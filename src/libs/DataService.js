export const DataService = (api_path, param, a, b) => {
    window.$.ajax({
        type: 'POST',
        url: _DataService + api_path,
        data: param,
        dataType: 'json',
        async: false,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        success: a,
        error: b
    });
};