const handleMultipartData = require("../../config/multer/workImg");
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

                const { title, description, volunteer_count, category, subcategory } = req.body;

                try {
                    await Work.create({
                        posted_by: req.user._id,
                        image: `images/works/${fileName}`,
                        title,
                        description,
                        volunteer_count,
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

                return res.redirect("/profile/mywork/posted");
            })
        },
        acceptWork: async (req, res) => {
            const work = await Work.findById(req.params.id);
            let flag = false;

            work.accepted_by.forEach(val => {
                if (JSON.stringify(val._id) == JSON.stringify(req.user._id)) {
                    flag = true;
                }
            })

            if (flag) {
                req.flash("error", "Alredy accepted a work.")
                return res.redirect(`/volunteering/work/category/${work.category}/${work._id}`)
            }

            if (work.volunteer_count > 0) {
                work.volunteer_count -= 1;
                work.accepted_by.push(req.user._id);
            }
            if (work.volunteer_count == 0) {
                work.accepted = true;
            }
            work.save();

            return res.redirect("/profile/mywork/accepted");
        },

        // Display all works and details by their category
        category: async (req, res) => {
            if (req.params.category == "all") {
                const works = await Work.find({ accepted: false }).populate("posted_by");

                return res.render("work/category", { works: works });
            }

            const works = await Work.find({ category: req.params.category }).populate("posted_by");

            return res.render("work/category", { works: works });
        },
        workDetails: async (req, res) => {
            const work = await Work.findById(req.params.id).populate("accepted_by");

            console.log(work)

            if (work) {
                return res.render("work/workDetails", { work: work });
            }

            return res.redirect("/");
        },

        // Display work posted and accepted by user
        postedWorks: async (req, res) => {
            const works = await Work.find({ posted_by: req.user._id, accepted: false }, null, {
                sort: { createdAt: -1 },
            })

            return res.render("work/posted", { works: works });
        },
        acceptedWork: async (req, res) => {
            const works = await Work.find({ accepted_by: { _id: req.user._id } }, null, {
                sort: { createdAt: -1 },
            }).populate("accepted_by");

            let User = null;

            works.forEach(work => {
                work.accepted_by.forEach(user => {
                    if (JSON.stringify(user._id) == JSON.stringify(req.user._id)) {
                        User = user
                    }
                })
            })

            return res.render("work/accepted", { works: works, user: User });
        },

        deleteWork: async (req, res) => {
            const work = await Work.findByIdAndDelete(req.params.id);

            return res.redirect("/profile/mywork/posted")
        }
    }
}

module.exports = workController;