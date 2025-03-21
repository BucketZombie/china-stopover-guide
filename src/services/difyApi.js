// Dify API配置
const DIFY_API_URL = process.env.REACT_APP_DIFY_API_URL || 'http://localhost/v1';
const DIFY_API_KEY = process.env.REACT_APP_DIFY_API_KEY || 'app-uGTs958P68NFcqJFvvXO9wVQ';

/**
 * 调用Dify工作流生成旅行报告
 * @param {Object} params - 旅行参数
 * @param {String} userId - 用户ID，可用于关联API服务器中的参数
 * @returns {Promise} - 工作流执行结果
 */
export const runDifyWorkflow = async (params, userId = null) => {
  try {
    console.log('正在调用Dify工作流...', params);
    console.log('使用的用户ID:', userId || `user-${Date.now()}`);
    
    const response = await fetch(`${DIFY_API_URL}/workflows/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIFY_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: params,
        response_mode: 'blocking',
        user: userId || `user-${Date.now()}` // 使用传入的用户ID或生成新的
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Dify工作流执行结果:', result);
    
    return {
      success: true,
      data: processWorkflowOutput(result)
    };
  } catch (error) {
    console.error('调用Dify工作流失败:', error);
    throw error;
  }
};

/**
 * 处理工作流输出，转换为前端可用的报告格式
 * @param {Object} workflowResult - Dify工作流输出
 * @returns {Object} - 格式化的报告数据
 */
function processWorkflowOutput(workflowResult) {
  console.log('处理Dify工作流输出:', JSON.stringify(workflowResult, null, 2));
  
  // 处理响应格式 {workflow_run_id, task_id, data: {outputs: {...}}}
  let outputs = workflowResult.outputs;
  
  // 如果响应是嵌套在data.outputs中，则提取它
  if (workflowResult.data && workflowResult.data.outputs) {
    outputs = workflowResult.data.outputs;
    console.log('从data.outputs中提取输出:', outputs);
  }
  
  // 检查是否有有效输出
  if (!outputs || typeof outputs !== 'object') {
    throw new Error('工作流未返回有效输出');
  }
  
  // 根据Dify输出格式进行处理
  let reportText = '';
  
  // 优先查找report键
  if (outputs.report) {
    console.log('找到report键输出');
    reportText = outputs.report;
  } else if (outputs.text) {
    console.log('找到text键输出');
    reportText = outputs.text;
  } else {
    // 尝试查找第一个字符串输出
    console.log('未找到report或text键，尝试查找第一个字符串输出');
    for (const key in outputs) {
      if (typeof outputs[key] === 'string') {
        console.log(`找到键 ${key} 的字符串输出`);
        reportText = outputs[key];
        break;
      }
    }
  }
  
  if (!reportText) {
    console.error('无法提取报告文本，完整输出:', outputs);
    throw new Error('工作流未返回文本报告');
  }
  
  console.log('提取的报告文本长度:', reportText.length);
  
  // 将文本报告转换为结构化报告
  return formatReportText(reportText);
}

/**
 * 将文本报告格式化为结构化数据
 * @param {string} text - 原始报告文本
 * @returns {Object} - 结构化报告数据
 */
function formatReportText(text) {
  console.log('格式化报告原始文本，保留Markdown:', text.substring(0, 100) + '...');
  
  // 将整个文本作为Markdown内容保存
  return {
    title: 'China Stopover Travel Report',
    markdown: text, // 保存原始Markdown文本
    // 为了兼容现有代码，我们仍然提供基本结构
    introduction: '',
    sections: [
      {
        title: '',
        content: ''
      }
    ]
  };
} 