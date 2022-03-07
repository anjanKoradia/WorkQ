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

                const { title, description, category, subcategory } = req.body;

                try {
                    await Work.create({
                        posted_by: req.user._id,
                        image: `images/works/${fileName}`,
                        title,
                        description,
                        category,
                        subcategory
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

                return res.redirect("/pofile/mywork/posted");
            })
        },

        postedWorks: async (req, res) => {
            const works = await Work.find({ user_id: req.user._id, accepted: false }, null, {
                sort: { createdAt: -1 },
            })
            return res.render("work/posted", { works: works });
        },

        category: async (req, res) => {
            if (req.params.category == "all") {
                const works = await Work.find().populate("posted_by");

                return res.render("work/category", { works: works });
            }

            const works = await Work.find({ category: req.params.category }).populate("posted_by");

            return res.render("work/category", { works: works });
        },

        workDetails: async (req, res) => {
            const work = await Work.findById(req.params.id);

            if (work) {
                return res.render("work/workDetails", { work: work });
            }

            return res.redirect("/");
        },
    }
}

module.exports = workController;