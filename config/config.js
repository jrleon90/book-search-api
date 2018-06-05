require('dotenv').config();

CONFIG = {}

CONGIF.app          = process.env.app   ||  'development';
CONFIG.port         = process.env.port  ||  '3000'