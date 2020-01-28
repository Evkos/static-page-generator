const templatesPath = process.env.TEMPLATES_PATH;

const TemplateProcessor = require('./src/TemplatesProcessor');
const templatesProcessor = new TemplateProcessor(templatesPath);

templatesProcessor.run();
templatesProcessor.setEventHandlers();









