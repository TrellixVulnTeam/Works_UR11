import React, {useState, useEffect, useRef} from 'react';
import PostList from '../components/PostList';
import '../styles/App.css';
import PostForm from '../components/PostForm';
import PostFilter from '../components/PostFilter';
import MyModal from '../components/UI/MyModal/MyModal';
import MyButton from '../components/UI/button/MyButton';
import { usePosts } from '../hooks/usePosts';
import PostService from '../API/PostService';
import Loader from '../components/UI/Loader/Loader';
import { useFetching } from '../hooks/useFetching';
import { getPageCount } from '../utils/pages';
import MyPagination from '../components/UI/pagination/MyPagination';
import { useObserver } from '../hooks/useObserver';
import MySelect from '../components/UI/select/MySelect';

function Posts() {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState({sort: '', query: ''})
  const [modal, setModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [queryParam, setQueryParam] = useState({limit: 10, page: 1});
  const lastElement = useRef();

  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
  const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
    const response = await PostService.getAll(queryParam.limit, queryParam.page);
    setPosts([...posts, ...response.data])
    const totalCount = response.headers['x-total-count']
    setTotalPages(getPageCount(totalCount, queryParam.limit))
  })

  useObserver(lastElement, queryParam.page < totalPages, isPostsLoading, () => {
    setQueryParam({...queryParam, page: queryParam.page + 1});
  })

  useEffect(() => {
    fetchPosts()
  }, [queryParam.page, queryParam.limit])

  const createPost = (newPost) => {
    setPosts([...posts, newPost])
    setModal(false)
  }

  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id))
  }

  const changePage = (page) => {
    setQueryParam({...queryParam, page: page})
  }

  return (
    <div className="App">
      <MyButton style={{marginTop: '30px'}} onClick={() => setModal(true)}>
        Создать пост
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost} />
      </MyModal>

      <hr style={{margin: '15px 0'}} />
      <PostFilter
        filter={filter}
        setFilter={setFilter}
      />
      <MySelect
        value={queryParam.limit}
        onChange={value => setQueryParam({...queryParam, limit: value})}
        defaultValue='Количество элементов на странице'
        options={[
          {value: 5, name: '5'},
          {value: 10, name: '10'},
          {value: 25, name: '25'},
          {value: -1, name: 'Показать все посты'},
        ]}
      />
      {postError &&
        <h1>Произошла ошибка ${postError}</h1>
      }
      <PostList remove={removePost} posts={sortedAndSearchedPosts} title='Список постов' />
      <div ref={lastElement} style={{height:'20px', backgroundColor: 'teal'}}></div>
      {isPostsLoading &&
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px'}}><Loader /></div>
      }
      <MyPagination
        page={queryParam.page}
        changePage={changePage}
        totalPages={totalPages}
      />

    </div>
  );
}

export default Posts;
