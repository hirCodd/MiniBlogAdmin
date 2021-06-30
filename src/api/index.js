import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

export const getArticles = () => {
    return request({
        url: "http://localhost:8090/api/admin/article/get/articles",
        method: "get"
    });
}