const { HfInference } = require("@huggingface/inference");
const Device = require('../models/Device');
const Employee = require('../models/Employee');
const Subscription = require('../models/Subscription');

class AIService {
  constructor() {
    this.client = new HfInference(process.env.HF_API_KEY);
    this.model = "Qwen/Qwen2.5-Coder-32B-Instruct";
  }

  async processMessage(message) {
    try {
      // First, analyze the message to determine intent
      const intent = await this.analyzeIntent(message);
      
      // Then perform the corresponding database operation
      const result = await this.performDatabaseOperation(intent);
      
      // Format the response
      const response = this.formatResponse(intent, result);
      return response;
    } catch (error) {
      console.error('AI Service Error:', error);
      return 'Sorry, I encountered an error processing your request.';
    }
  }

  async analyzeIntent(message) {
    try {
      const chatCompletion = await this.client.chatCompletion({
        model: this.model,
        messages: [
          {
            role: "system",
            content: `You are an AI assistant helping with inventory management. 
                     Extract relevant information from user messages to perform database operations.
                     Respond with a JSON object containing: action (query/add/update/delete), 
                     entity (device/employee/subscription), and any relevant parameters.`
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 500
      });

      const content = chatCompletion.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to analyze message intent');
    }
  }

  async performDatabaseOperation(intent) {
    const { action, entity, parameters } = intent;
    let result;

    const modelMap = {
      device: Device,
      employee: Employee,
      subscription: Subscription
    };

    const Model = modelMap[entity];

    if (!Model) {
      throw new Error('Invalid entity type');
    }

    try {
      switch (action) {
        case 'query':
          result = await Model.find(parameters || {});
          break;
        case 'add':
          const newItem = new Model(parameters);
          result = await newItem.save();
          break;
        case 'update':
          result = await Model.findByIdAndUpdate(parameters.id, parameters.updates, { new: true });
          break;
        case 'delete':
          result = await Model.findByIdAndDelete(parameters.id);
          break;
        default:
          throw new Error('Invalid action');
      }
      return result;
    } catch (error) {
      console.error('Database operation error:', error);
      throw new Error(`Failed to perform ${action} operation on ${entity}`);
    }
  }

  formatResponse(intent, result) {
    try {
      const { action, entity } = intent;
      
      switch (action) {
        case 'query':
          if (Array.isArray(result)) {
            return `Found ${result.length} ${entity}(s):\n${JSON.stringify(result, null, 2)}`;
          }
          return `Here's the ${entity} information:\n${JSON.stringify(result, null, 2)}`;
        
        case 'add':
          return `Successfully added new ${entity}:\n${JSON.stringify(result, null, 2)}`;
        
        case 'update':
          return `Successfully updated ${entity}:\n${JSON.stringify(result, null, 2)}`;
        
        case 'delete':
          return `Successfully deleted ${entity}`;
        
        default:
          return 'Operation completed successfully';
      }
    } catch (error) {
      console.error('Response formatting error:', error);
      return 'Operation completed but failed to format response';
    }
  }
}

module.exports = new AIService();