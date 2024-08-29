'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDeed, fetchDeeds, updateDeed, deleteDeed } from '@/redux/slices/deedsSlice';
import { RootState } from '@/redux/store';

import styles from './index.module.scss'
import { deleteUser } from '@/redux/slices/userSlice';

const DeedsComponent: React.FC = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { deeds, status, error } = useSelector((state: RootState) => state.deeds);
  const userName = useSelector((state:RootState) => state.accountUser.name);

  useEffect(() => {
    dispatch(fetchDeeds());
  }, [dispatch]);

  const handleCreateDeed = () => {
    dispatch(createDeed({ title, description }));
  };

  const handleUpdateDeed = (deedId: string) => {
    dispatch(updateDeed({ deedId, title, description }));
  };

  const handleDeleteDeed = (deedId: string) => {
    dispatch(deleteDeed(deedId));
  };

  // const handleUpdate = () => {
  //   dispatch(updateUser({ name, password }));
  // };

  const handleDelete = () => {
    dispatch(deleteUser());
  };


  return (
    <>
      <aside>
        <div>User:{userName}</div>
        <button onClick={handleDelete}>Удалить пользователя</button>
      </aside>
    <div className={styles.deeds}>
      <h2>Управление делами</h2>
      <input
        className={styles.input}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button className={styles.button} onClick={handleCreateDeed}>Создать дело</button>

      {status === 'loading' && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <ul className={styles.list}>
        <p>Список дел</p>
        {deeds.map(deed => (
          <li key={deed.deedId}>
            <h3>Название дела:{deed.title}</h3>
            <p>Описание дела:{deed.description}</p>
            <button className={styles.button} onClick={() => handleUpdateDeed(deed.deedId)}>Изменить</button>
            <button className={styles.button} onClick={() => handleDeleteDeed(deed.deedId)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default DeedsComponent;
