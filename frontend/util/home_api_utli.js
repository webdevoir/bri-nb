export const fetchHomes = (filters) => {
    return $.ajax({
        method: 'GET',
        url: 'api/homes',
        data: filters
    });
};