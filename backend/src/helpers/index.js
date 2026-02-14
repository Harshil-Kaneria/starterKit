const crypto = require('crypto');
const { getReasonPhrase } = require('http-status-codes');
const nodemailer = require('nodemailer');
const datatable = require('sequelize-datatable');
const { Op } = require('sequelize');
const { getBoolean, getString, getNumber } = require('../config/runtime');
const logger = require('../shared/logger/logger');

const isResponseEncryptionEnabled = () => getBoolean('RESPONSE_ENCRYPTION_ENABLED', true);

const deriveEncryptionKey = (secret) => crypto.createHash('sha256').update(secret).digest();

const encryptPayload = (payload, secret) => {
  const iv = crypto.randomBytes(12);
  const key = deriveEncryptionKey(secret);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString('base64')}.${authTag.toString('base64')}.${encrypted.toString('base64')}`;
};

const generateResponse = (req, res, statusCode, status, message = '', data) => {
  const finalMessage = message === '' ? getReasonPhrase(statusCode) : message;
  const response = {
    status,
    message: finalMessage,
    ...data
  };

  if (isResponseEncryptionEnabled()) {
    const encryptionKey = getString('RESPONSE_ENCRYPTION_KEY', '');
    if (!encryptionKey) {
      throw new Error('RESPONSE_ENCRYPTION_KEY is required when RESPONSE_ENCRYPTION_ENABLED=true');
    }
    const payload = encryptPayload(response, encryptionKey);
    res.set('x-payload-enc', 'aes-256-gcm');
    return res.status(statusCode).json({ enc: true, payload });
  }

  return res.status(statusCode).json(response);
};

const sendMail = async (to = '', subject = '', html = '') => {
  try {
    if (!to || !subject || !html) return false;

    const mailHost = getString('MAIL_HOST', '');
    const mailUser = getString('MAIL_USER', '');
    const mailPass = getString('MAIL_PASS', '');
    if (!mailHost || !mailUser || !mailPass) {
      logger.warn('Mail server is not configured; skipping email send.');
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: mailHost,
      port: getNumber('MAIL_PORT', 465),
      auth: {
        user: mailUser,
        pass: mailPass
      }
    });

    await transporter.sendMail({
      from: getString('MAIL_SENDER', ''),
      to,
      subject,
      html
    });

    return true;
  } catch (error) {
    logger.error({ error }, 'Failed to send email');
    return false;
  }
};

const dataTableHelper = async (data = {}) => {
  if (!data) return {};

  const searchableColumns = data.searchableColumns || [];
  const whereCondition = data.whereCondition || {};
  const query = data.query || {};
  const include = data.include || [];
  const attributes = data.attributes || undefined;
  const orderColumnMap = data.orderColumnMap || {};
  const orderColumnWhitelist = data.orderColumnWhitelist || [];

  const requestedOrderColumn = query.orderColumn || 'id';
  const normalizedOrderColumn = orderColumnMap[requestedOrderColumn] || requestedOrderColumn;
  const safeOrderColumn = orderColumnWhitelist.includes(normalizedOrderColumn) ? normalizedOrderColumn : 'id';

  const requestedOrderDirection = String(query.orderDirection || 'DESC').toUpperCase();
  const safeOrderDirection = requestedOrderDirection === 'ASC' ? 'ASC' : 'DESC';

  const whereClause = {
    ...whereCondition,
    ...(query.search && searchableColumns.length
      ? {
          [Op.or]: searchableColumns.map((column) => ({ [column]: { [Op.like]: `%${query.search}%` } }))
        }
      : {})
  };

  const options = {
    order: [[safeOrderColumn, safeOrderDirection]],
    where: whereClause,
    include,
    attributes
  };

  const [result, totalRecords] = await Promise.all([
    datatable(data.model, query, options),
    data.model.count({ where: whereClause })
  ]);

  return {
    status: true,
    message: 'Data fetched successfully!',
    ...result,
    recordsTotal: totalRecords
  };
};

module.exports = {
  generateResponse,
  sendMail,
  dataTableHelper
};
