export const DataService = (api_path, param, a, b) => {
    window.$.ajax({
        type: 'POST',
        //10.25.67.72
        url: 'http://10.25.67.162:8080/trafficIndex_web' + api_path,
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