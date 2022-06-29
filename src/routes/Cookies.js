const Cookies = {
    GET_LANG: (req, res) => {
        const { lang } = req.query;
        console.log(lang);
        if (lang) {
            res.cookie("language", lang);
            res.send({
              status: 200,
              language:lang
            });
        } else {
            res.send({
                status: 200,
                language: req.cookies["language"] ? req.cookies["language"] : 'uz',
            });
        }
    },
    
    GET_THEME: (req, res) => {
        const { theme } = req.query;
        if (theme) {
            res.cookie("theme", theme);
        }
        res.send({
            status: 200,
            theme: req.cookies['theme']?req.cookies['theme']:theme,
        });
    },
};

module.exports = {
    Cookies,
};
