import airdropModel from '../models/airdrop.model.js';
import Airdrop from '../models/airdrop.model.js';
import userModel from '../models/user.model.js';
export const createAirdrop = async (req, res) => {
  try {
    const { projectName, reward, status, notes } = req.body;
    if (!projectName) {
      return res.status(400).json({
        message: "Project name are required",
        seccess: false
      })
    }
    const id = req.user.id;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(400).json({
        message: "user Not found",
        seccess: false
      })

    }
    console.log("Printing user id", req.user.id)

    const newAirdrop = new Airdrop({
      user: id,
      projectName,
      reward,
      status,
      notes
    });

    await newAirdrop.save();
    const updateAirdrop = await userModel.findByIdAndUpdate({ _id: id }, {
      $push: {
        airdrops: newAirdrop._id
      }
    }, { new: true })

    await updateAirdrop.save()
    res.status(201).json({ message: 'Airdrop created', airdrop: newAirdrop });
  } catch (err) {
    console.log("error in creating airdrop", err)
    res.status(500).json({ message: 'Failed to create airdrop', error: err.message });
  }
};



export const updateAirdrop = async (req, res) => {
  const userId = req.user.id; // from auth middleware
  const airdropId = req.params.id;
  const { projectName, reword, status, notes } = req.body;
  console.log("id in params", airdropId)
  try {

    const allowedFields = ['projectName', 'reword', 'status', 'notes'];
    const sentFields = Object.keys(req.body);

    // Check if any extra/unexpected field is sent
    const invalidFields = sentFields.filter(field => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Invalid field(s): ${invalidFields.join(', ')}`
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if airdropId exists in user's airdrops array
    const ownsAirdrop = user.airdrops.some(
      (id) => id.toString() === airdropId
    );
    console.log("ownsAirdrop", ownsAirdrop)
    if (!ownsAirdrop) {
      return res.status(403).json({
        message: "You don't have permission to update this airdrop.",
      });
    }

    // Prepare update object to only update passed fields
    const updateData = {};
    if (projectName !== undefined) updateData.projectName = projectName;
    if (reword !== undefined) updateData.reword = reword;
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updatedAirdrop = await Airdrop.findByIdAndUpdate(
      airdropId,
      updateData,
      { new: true }
    );

    if (!updatedAirdrop) {
      return res.status(404).json({ message: "Airdrop not found." });
    }

    res.json({
      message: "Airdrop updated successfully",
      airdrop: updatedAirdrop,
    });
  } catch (err) {
    console.error("Error updating airdrop:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteAirdrop = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const airdropId = req.params.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if airdropId exists in user's airdrops array
    const ownsAirdrop = user.airdrops.some(
      (id) => id.toString() === airdropId
    );
    console.log("ownsAirdrop", ownsAirdrop)
    if (!ownsAirdrop) {
      return res.status(403).json({
        message: "You don't have permission to delete this airdrop.",
      });
    }

    // 1. Delete the airdrop
    await airdropModel.findByIdAndDelete(airdropId);

    // 2. Remove airdropId from user's airdrops array
    await userModel.findByIdAndUpdate(
      userId,
      { $pull: { airdrops: airdropId } },
      { new: true }
    );

    res.status(200).json({ message: "Airdrop deleted successfully." });

  } catch (error) {
    console.error("Error deleting airdrop:", error);
    res.status(500).json({ message: "Server error" });
  }
}


//get all airdrop

export const getMyAirdrops = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId).populate({
      path: "airdrops",
      select: " projectName reward status notes createdAt updatedAt"
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ airdrops: user.airdrops });

  } catch (err) {
    console.error("Error fetching airdrops:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//get airdrop by id 

export const getAirdropById = async (req, res) => {
  const { id } = req.params;
  try {
    const airdrop = await airdropModel.findById(id).select("-__v -airdrops").populate({
      path:"user",
      select:"username email"
    });
    if (!airdrop) {
      return res.status(404).json({ message: "Airdrop not found" });
    }
    res.json(airdrop)
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//Get by Name / Keyword 
export const searchAirdrops = async (req, res) => {
  const keyword = req.query.keyword || req.query.name;

  if (!keyword) {
    return res.status(400).json({ message: "Keyword or name query is required." });
  }

  try {
    const results = await airdropModel.find({
      projectName: { $regex: keyword, $options: "i" }
    }).select("-__v -updatedAt");

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



//Filter by Status or Reward
export const filterAirdrops = async (req, res) => {
  const { status } = req.query;

  const filter = {};
  if (status) filter.status = status;

  try {
    const filtered = await airdropModel.find(filter)
      .select("-__v -updatedAt");

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
};



export const getAirdropSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: Get only received airdrops of the user
    const receivedAirdrops = await airdropModel.find({
      user: userId,
      status: "received"
    });

    // Step 2: Calculate total earning
    let totalEarning = 0;
    receivedAirdrops.forEach((airdrop) => {
      const numericReward = parseFloat(airdrop.reward);
      console.log("numericReward",numericReward)
      if (!isNaN(numericReward)) {
        totalEarning += numericReward;
      }
    });

    res.json({
      totalEarning,
      receivedCount: receivedAirdrops.length
    });

  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ message: "Server error" });
  }
};
