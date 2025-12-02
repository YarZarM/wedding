'use client'

import { useState, useEffect } from 'react';

export default function WishesAdmin() {
  const [wishes, setWishes] = useState([]);

  useEffect(() => {
    fetchWishes();
  }, []);

  async function fetchWishes() {
    const response = await fetch('/api/admin/wishes');
    const data = await response.json();
    setWishes(data);
  }

  async function approveWish(id: string) {
    await fetch(`/api/admin/wishes/${id}/approve`, { method: 'POST' });
    fetchWishes();
  }

  async function deleteWish(id: string) {
    await fetch(`/api/admin/wishes/${id}`, { method: 'DELETE' });
    fetchWishes();
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-serif mb-8">Moderate Wedding Wishes</h1>
      
      <div className="space-y-4">
        {wishes.map((wish: any) => (
          <div key={wish.id} className="border-2 border-black p-6">
            <p className="font-semibold">{wish.name}</p>
            <p className="italic my-4">"{wish.message}"</p>
            <p className="text-sm text-gray-500">{wish.email}</p>
            
            <div className="flex gap-4 mt-4">
              {!wish.approved && (
                <button
                  onClick={() => approveWish(wish.id)}
                  className="bg-green-600 text-white px-4 py-2"
                >
                  Approve
                </button>
              )}
              <button
                onClick={() => deleteWish(wish.id)}
                className="bg-red-600 text-white px-4 py-2"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}