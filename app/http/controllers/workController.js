const handleMultipartData = require("../../config/multer");
const workDetailsValidator = require("../../validator/workValidator");
const fs = require("fs");
const Work = require("../../models/work");

function workController() {
    return {
        index: (req, res) => {
            return res.render("work/postWork")
        },

        postWork: (req, res) => {
            handleMultipartData(req, res, async (err) => {
                if (err) {
                    req.flash(err.message);
                    return res.redirect("/volunteering/work/post")
                }

                // path of image save in folder
                let fileName;

                if (req.file) {
                    fileName = req.file.filename;
                } else {
                    req.flash("error", "Image is required.");
                    return res.redirect("/volunteering/work/post")
                }

                const { error } = workDetailsValidator.validate(req.body);

                if (error) {
                    if (fileName) {
                        fs.unlink(
                            `${appRoot}/public/images/works/${fileName}`,
                            (err) => {
                                if (err) {
                                    return req.flash("error", "Somthing went wrong.");
                                }
                            }
                        );
                    }
                    req.flash("error", "All fields are required.");
                    return res.redirect("/volunteering/work/post")
                }

                const { title, subtitle, description, category } = req.body;

                let document;
                try {
                    document = await Work.create({
                        user_id: req.user._id,
                        image: `images/works/${fileName}`,
                        title,
                        subtitle,
                        description,
                        category
                    });
                } catch (err) {
                    fs.unlink(`${appRoot}/public/images/works/${fileName}`, (err) => {
                        if (err) {
                            req.flash("error", "Somthing went worng.");
                            return res.redirect("/volunteering/work/post");
                        }
                    });
                    req.flash("error", "Somthing went worng.");
                    return res.redirect("/volunteering/work/post");
                }

                return res.redirect("/");
            })
        },

        postedWorks: async (req, res) => {
            const works = await Work.find({ user_id: req.user._id }, null, {
                sort: { createdAt: -1 },
            });
            console.log(works)
            return res.render("work/posted", { works: works });
        }
    }
}

module.exports = workController;