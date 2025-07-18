import React from "react";
import type { Character } from "../types";



interface AddCharacterCardProps {
  onClick: () => void;
}

// “添加角色”卡片组件的预想设计
const AddCharacterCard: React.FC<AddCharacterCardProps> = ({ onClick }) => (
    <div
        onClick={onClick}
        className="group bg-white bg-opacity-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:border-blue-500 hover:bg-white hover:shadow-lg min-h-[232px]"
        // style={{ minHeight: '232px' }} // 与CharacterCard高度保持大致一致 使用min-h-[232px]代替了。
    >
        <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
            {/* 你可以使用图标库，或者直接用文字 */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
        </div>
        <p className="mt-2 font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">
            创建自定义角色
        </p>
    </div>
);

export default AddCharacterCard;