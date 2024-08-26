import React, { useEffect, useState, useCallback, useMemo } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = ({ country, category, apiKey, pageSize, setProgress }) => {
  const [state, setState] = useState({
    articles: [],
    loading: true,
    page: 1,
    totalResults: 0,
  });

  const capitalizeFirstLetter = useCallback(
    (string) => string.charAt(0).toUpperCase() + string.slice(1),
    []
  );

  const buildUrl = useMemo(
    () =>
      (page) =>
        `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`,
    [country, category, apiKey, pageSize]
  );

  const updateNews = useCallback(async () => {
    try {
      setProgress(10);
      setState((prevState) => ({ ...prevState, loading: true }));
      const url = buildUrl(state.page);
      const data = await fetch(url);
      setProgress(30);
      const parsedData = await data.json();
      setProgress(70);
      setState((prevState) => ({
        ...prevState,
        articles: parsedData.articles,
        totalResults: parsedData.totalResults,
        loading: false,
      }));
      setProgress(100);
    } catch (error) {
      console.error("Error fetching news:", error);
      setProgress(100);
    }
  }, [buildUrl, state.page, setProgress]);

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(category)} - DailyGlobe`;
    updateNews();
  }, [updateNews, category, capitalizeFirstLetter]);

  const fetchMoreData = async () => {
    try {
      const newPage = state.page + 1;
      const url = buildUrl(newPage);
      const data = await fetch(url);
      const parsedData = await data.json();
      setState((prevState) => ({
        ...prevState,
        articles: prevState.articles.concat(parsedData.articles),
        totalResults: parsedData.totalResults,
        page: newPage,
      }));
    } catch (error) {
      console.error("Error fetching more news:", error);
    }
  };

  return (
    <>
      <h1 className="text-center news-heading">
        Top Headlines of the day - {capitalizeFirstLetter(category)}
      </h1>
      {state.loading && <Spinner />}
      <InfiniteScroll
        dataLength={state.articles.length}
        next={fetchMoreData}
        hasMore={state.articles.length !== state.totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {state.articles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title || ""}
                  description={element.description || ""}
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author || "Unknown"}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
  setProgress: PropTypes.func.isRequired,
};

export default News;
