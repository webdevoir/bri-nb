export const fetchHomes = (filters) => (
    $.ajax({
        method: 'GET',
        url: 'api/homes',
        data: filters
    })
);

export const fetchHome = id => (
    $.ajax({
        method: 'GET',
        url: `api/homes/${id}`,
    })
);