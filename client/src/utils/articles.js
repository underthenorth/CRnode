import axios from 'axios';
import userStore from '@/stores/userStore';
import { compareDates } from '@/utils/dates';
import resourceStore from '@/stores/resourceStore';

export const updateArticle = async editedArticle => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/articles/${editedArticle._id}`, editedArticle);
    const updatedArticle = response.data;
    userStore.setArticles(
      userStore.articles.map(article => (article._id === updatedArticle._id ? updatedArticle : article))
    );
  } catch (error) {
    console.error('Error updating article:', error);
  }
};

export const createArticle = async article => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/articles/new`, article);
    console.log('Article created:', response.data);
    userStore.setArticles([...userStore.articles, response.data].sort(compareDates));
  } catch (error) {
    console.error('There was an error creating the article:', error);
  }
};

export const deleteArticle = async articleId => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/articles/${articleId}`);
    userStore.setArticles(userStore.articles.filter(article => article._id !== articleId));
  } catch (error) {
    console.error('Error deleting article:', error);
  }
};

export const filterAllowedArticles = async articles => {
  return articles.filter(article => {
    return userStore.user.permissions.some(permission => permission.purpose === article.purpose && permission.canRead);
  });
};

export const sortArticles = articles => {
  return articles.sort((a, b) => {
    return compareDates(a, b);
  });
};
