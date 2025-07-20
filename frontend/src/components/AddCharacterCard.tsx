// src/components/AddCharacterCard.tsx
import React, { type FC } from "react";

interface AddCharacterCardProps {
    onClick: () => void;
}
 
const AddCharacterCard: FC<AddCharacterCardProps> = ({ onClick }) => (
    <div
        onClick={onClick}
        className="h-80 w-64 group bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center"
    >
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-blue-100 rounded-full p-4 mb-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
            </div>
            <h3 className="font-bold text-lg text-gray-800">创建新角色</h3>
            <p className="text-sm text-gray-500 mt-2">点击添加自定义角色</p>
        </div>
    </div>
);

export default AddCharacterCard;
