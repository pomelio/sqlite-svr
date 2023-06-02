 
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const errorStackFormat = format(info => {
	if (info instanceof Error) {
	  return Object.assign({}, info, {
		stack: info.stack,
		message: info.message
	  })
	}
	return info
});

var logger = createLogger({
	level: process.env.LOG_LEVEL,
	format: format.combine(
		errorStackFormat(),
		format.errors({ stack: true }),
        format.colorize({ all: true }),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
		format.splat(),
		format.simple()
	),
    transports: [
		new transports.Console(),
		new transports.DailyRotateFile({
				filename: process.env.LOG_ROTATE_FILE_NAME,
				datePattern: process.env.LOG_ROTATE_DATE_PATTERN,
				zippedArchive: true,
				maxSize: process.env.LOG_ROTATE_MAX_SIZE,
				maxFiles: process.env.LOG_ROTATE_MAX_FILES,
			
		})
    ]
});

module.exports = logger;