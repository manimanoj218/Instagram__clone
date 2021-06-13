const Connections = require("../models/connection.model");
const Activities = require("../models/activity.model");

const getUserActivity = async(req, res) => {
    const { user:{ _id } } = req;
    
    const activities = await Activities.findById(_id).select({ __v:0,createdAt:0,updatedAt:0 })
    .populate([{ path:"requests",select:"username pic" },{path:"activity.user",select:"pic username"}])
    .lean();

    res.status(200).json({ activities })
}

const confirmFollowRequest = async (req, res) => {
    const { userId } = req.params;
    const {
        user: { _id }
    } = req;

    try {
        let [connections,senderconnections,activities] = await Promise.all(
            [
                Connections.findById(_id),
                Connections.findById(userId),
                Activities.findById(_id)
            ]);

        // update user followers and senders following
        connections.followers.push(userId);
        senderconnections.following.push(_id);

        // delete request from activities
        activities.requests.remove(userId);

        // push notification
        activities.activity.push({
             user: userId,
             text: "started following you.",
        });

        // save all data
        await Promise.all([connections.save(),senderconnections.save(),activities.save()])
        await activities.populate([{ path:"requests",select:"username pic" },{path:"activity.user",select:"pic username"}]).execPopulate()
        return res.status(200).json({ activities,connections});
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteFollowRequest = async (req, res) => {
    const { userId } = req.params;
    const { user: { _id } } = req;

    try {
        // get user activities
        let activities = await Activities.findById(_id);

        if (userId) {
            // delete request from activities
            activities.requests.remove(userId);
            await activities.save(async(err,activities) => {
                if(activities){
                   await activities.populate([{ path:"requests",select:"username pic" },{path:"activity.user",select:"pic username"}]).execPopulate()
                   return res.status(200).json({ activities });
                }
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = { getUserActivity,confirmFollowRequest,deleteFollowRequest }