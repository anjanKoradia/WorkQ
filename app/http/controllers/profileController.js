const moment = require("moment");
const Work = require("../../models/work");

function profileController() {
    return {
        index: async (req, res) => {
            const postedWork = await Work.find({ posted_by: req.user._id }, null, { limit: 3, sort: { createdAt: -1 } })
            const acceptedWork = await Work.find({ accepted_by: req.user._id }, null, { limit: 3, sort: { createdAt: -1 } }).populate("accepted_by")

            return res.render("profile", { postedWork: postedWork, acceptedWork: acceptedWork, moment: moment });
        }
    }
}

module.exports = profileController;