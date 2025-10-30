import React from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';

type Announcement = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

type Props = {
  announcements: Announcement[];
};

const AnnouncementList = ({ announcements }: Props) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Announcement</h3>
        <span className="text-sm text-gray-500">Today, {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      </div>
      
      <div className="space-y-4">
        {announcements.map((item) => (
          <div key={item.id} className="flex items-start p-4 bg-gray-100 rounded-lg">
            <div className="flex-1">
              <p className="font-semibold text-gray-700">{item.title}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
              <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('fr-FR', { weekday: 'long' })}</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <FiMoreHorizontal />
            </button>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
          See All Announcement
        </a>
      </div>
    </div>
  );
};

export default AnnouncementList;