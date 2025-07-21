import edge_tts
import asyncio
import os
from typing import Optional

class TTSService:
    def __init__(self):
        # 默认使用中文女声
        self.voice = "zh-CN-XiaoxiaoNeural"
        # 语速 (默认 +0%)
        self.rate = "+0%"
        # 音量 (默认 +0%)
        self.volume = "+0%"
    
    async def text_to_speech_async(self, text: str, output_file: str) -> Optional[str]:
        """
        将文本转换为语音文件（异步方法）
        
        Args:
            text: 要转换的文本
            output_file: 输出的音频文件路径
            
        Returns:
            str: 生成的音频文件路径，如果失败则返回None
        """
        try:
            # 确保输出目录存在
            os.makedirs(os.path.dirname(output_file), exist_ok=True)
            
            # 创建通信对象
            communicate = edge_tts.Communicate(
                text, 
                self.voice,
                rate=self.rate,
                volume=self.volume
            )
            
            # 生成语音文件
            await communicate.save(output_file)
            return output_file
            
        except Exception as e:
            print(f"TTS转换失败: {str(e)}")
            return None
    
    def text_to_speech(self, text: str, output_file: str) -> Optional[str]:
        """
        将文本转换为语音文件（同步方法）
        """
        return asyncio.run(self.text_to_speech_async(text, output_file))
    
    def set_voice(self, voice: str):
        """设置语音（例如：zh-CN-XiaoxiaoNeural, en-US-JennyNeural）"""
        self.voice = voice
    
    def set_rate(self, rate: str):
        """设置语速（例如：+50%，-50%）"""
        self.rate = rate
    
    def set_volume(self, volume: str):
        """设置音量（例如：+50%，-50%）"""
        self.volume = volume

# 创建全局TTS服务实例
tts_service = TTSService() 