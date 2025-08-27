import { ChatMode } from '@repo/shared/config';
import { CoreMessage } from 'ai';
import { ProviderEnumType } from './providers';

export enum ModelEnum {
    GPT_4o_Mini = 'gpt-4o-mini',
    GPT_4o = 'gpt-4o',
    GPT_4_1_Mini = 'gpt-4.1-mini',
    GPT_4_1_Nano = 'gpt-4.1-nano',
    GPT_4_1 = 'gpt-4.1',
    LLAMA_4_SCOUT = 'accounts/fireworks/models/llama4-scout-instruct-basic',
    Deepseek_R1_Distill_Qwen_14B = 'deepseek-r1-distill-qwen-14b',
    Claude_3_5_Sonnet = 'claude-3-5-sonnet-20240620',
    O4_Mini = 'o4-mini',
    GEMINI_2_5_FLASH = 'gemini-2.5-flash',
    QWQ_32B = 'accounts/fireworks/models/qwq-32b',
    Deepseek_R1 = 'accounts/fireworks/models/deepseek-r1',
    Claude_3_7_Sonnet = 'claude-3-7-sonnet-20250219',
}

export type Model = {
    id: ModelEnum;
    name: string;
    provider: ProviderEnumType;
    maxTokens: number;
    contextWindow: number;
};

export const models: Model[] = [
    {
        id: ModelEnum.GPT_4o_Mini,
        name: 'GPT-4o Mini',
        provider: 'openai',
        maxTokens: 16384,
        contextWindow: 16384,
    },
    {
        id: ModelEnum.GPT_4_1_Mini,
        name: 'GPT-4.1 Mini',
        provider: 'openai',
        maxTokens: 16384,
        contextWindow: 16384,
    },
    {
        id: ModelEnum.GPT_4_1_Nano,
        name: 'GPT-4.1 Nano',
        provider: 'openai',
        maxTokens: 16384,
        contextWindow: 16384,
    },
    {
        id: ModelEnum.GPT_4_1,
        name: 'GPT-4.1',
        provider: 'openai',
        maxTokens: 16384,
        contextWindow: 16384,
    },
    {
        id: ModelEnum.GPT_4o,
        name: 'GPT-4o',
        provider: 'openai',
        maxTokens: 16384,
        contextWindow: 16384,
    },
    {
        id: ModelEnum.O4_Mini,
        name: 'O4 Mini',
        provider: 'openai',
        maxTokens: 16384,
        contextWindow: 16384,
    },
    {
        id: ModelEnum.GPT_4o_Mini,
        name: 'GPT-4o Mini',
        provider: 'openai',
        maxTokens: 16384,
        contextWindow: 16384,
    },
    {
        id: ModelEnum.Deepseek_R1_Distill_Qwen_14B,
        name: 'DeepSeek R1 Distill Qwen 14B',
        provider: 'together',
        maxTokens: 16384,
        contextWindow: 16384,
    },
    {
        id: ModelEnum.Deepseek_R1,
        name: 'DeepSeek R1',
        provider: 'fireworks',
        maxTokens: 16384,
        contextWindow: 16384,
    },
    {
        id: ModelEnum.Claude_3_5_Sonnet,
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        maxTokens: 16384,
        contextWindow: 16384,
    },
    {
        id: ModelEnum.Claude_3_7_Sonnet,
        name: 'Claude 3.7 Sonnet',
        provider: 'anthropic',
        maxTokens: 16384,
        contextWindow: 16384,
    },
    {
        id: ModelEnum.GEMINI_2_5_FLASH,
        name: 'Gemini 2.5 Flash',
        provider: 'google',
        maxTokens: 200000,
        contextWindow: 200000,
    },
    {
        id: ModelEnum.QWQ_32B,
        name: 'QWQ 32B',
        provider: 'fireworks',
        maxTokens: 16384,
        contextWindow: 16384,
    },
    {
        id: ModelEnum.LLAMA_4_SCOUT,
        name: 'Llama 4 Scout',
        provider: 'fireworks',
        maxTokens: 16384,
        contextWindow: 16384,
    },
];

export const getModelFromChatMode = (mode?: string): ModelEnum => {
    switch (mode) {
        case ChatMode.GEMINI_2_5_FLASH:
            return ModelEnum.GEMINI_2_5_FLASH;
        case ChatMode.DEEPSEEK_R1:
            return ModelEnum.Deepseek_R1;
        case ChatMode.CLAUDE_3_5_SONNET:
            return ModelEnum.Claude_3_5_Sonnet;
        case ChatMode.CLAUDE_3_7_SONNET:
            return ModelEnum.Claude_3_7_Sonnet;
        case ChatMode.GPT_4o_Mini:
            return ModelEnum.GPT_4o_Mini;
        case ChatMode.GPT_4_1:
            return ModelEnum.GPT_4_1;
        case ChatMode.GPT_4_1_Mini:
            return ModelEnum.GPT_4_1_Mini;
        case ChatMode.GPT_4_1_Nano:
            return ModelEnum.GPT_4_1_Nano;
        case ChatMode.O4_Mini:
            return ModelEnum.O4_Mini;
        case ChatMode.GPT_4_1_Mini:
        default:
            return ModelEnum.GPT_4o_Mini;
    }
};

export const getChatModeMaxTokens = (mode: ChatMode) => {
    switch (mode) {
        case ChatMode.GEMINI_2_5_FLASH:
            return 500000;
        case ChatMode.DEEPSEEK_R1:
            return 100000;
        case ChatMode.CLAUDE_3_5_SONNET:
            return 100000;
        case ChatMode.CLAUDE_3_7_SONNET:
            return 100000;
        case ChatMode.O4_Mini:
            return 100000;
        case ChatMode.GPT_4o_Mini:
            return 100000;
        case ChatMode.Deep:
            return 100000;
        default:
            return 100000;
    }
};

export const estimateTokensByWordCount = (text: string): number => {
    // Simple word splitting by whitespace
    const words = text?.trim().split(/\s+/);

    // Using a multiplier of 1.35 tokens per word for English text
    const estimatedTokens = Math.ceil(words.length * 1.35);

    return estimatedTokens;
};

export const estimateTokensForMessages = (messages: CoreMessage[]): number => {
    let totalTokens = 0;

    for (const message of messages) {
        if (typeof message.content === 'string') {
            totalTokens += estimateTokensByWordCount(message.content);
        } else if (Array.isArray(message.content)) {
            for (const part of message.content) {
                if (part.type === 'text') {
                    totalTokens += estimateTokensByWordCount(part.text);
                }
            }
        }
    }

    return totalTokens;
};

export const trimMessageHistoryEstimated = (messages: CoreMessage[], chatMode: ChatMode) => {
    const maxTokens = getChatModeMaxTokens(chatMode);
    let trimmedMessages = [...messages];

    if (trimmedMessages.length <= 1) {
        const tokenCount = estimateTokensForMessages(trimmedMessages);
        return { trimmedMessages, tokenCount };
    }

    const latestMessage = trimmedMessages.pop()!;

    const messageSizes = trimmedMessages.map(msg => {
        const tokens =
            typeof msg.content === 'string'
                ? estimateTokensByWordCount(msg.content)
                : Array.isArray(msg.content)
                  ? msg.content.reduce(
                        (sum, part) =>
                            part.type === 'text' ? sum + estimateTokensByWordCount(part.text) : sum,
                        0
                    )
                  : 0;
        return { message: msg, tokens };
    });

    let totalTokens = messageSizes.reduce((sum, item) => sum + item.tokens, 0);

    // Count tokens for the latest message
    const latestMessageTokens =
        typeof latestMessage.content === 'string'
            ? estimateTokensByWordCount(latestMessage.content)
            : Array.isArray(latestMessage.content)
              ? latestMessage.content.reduce(
                    (sum, part) =>
                        part.type === 'text' ? sum + estimateTokensByWordCount(part.text) : sum,
                    0
                )
              : 0;

    totalTokens += latestMessageTokens;

    while (totalTokens > maxTokens && messageSizes.length > 0) {
        const removed = messageSizes.shift();
        if (removed) {
            totalTokens -= removed.tokens;
        }
    }

    trimmedMessages = messageSizes.map(item => item.message);
    trimmedMessages.push(latestMessage);

    return { trimmedMessages, tokenCount: totalTokens };
};
