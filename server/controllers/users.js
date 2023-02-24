import User from "../models/User";

/* READ */

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByID(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByID(id);
    const friends = await Promise.all(
      user.friends.map((id) => User.findByID(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstname, lastName, occupation, location, picturePath }) => {
        return { _id, firstname, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findByID(id);
    const friend = await User.findByID(friendId);
    if (user.friends.include(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();
    const friends = await Promise.all(
      user.friends.map((id) => User.findByID(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstname, lastName, occupation, location, picturePath }) => {
        return { _id, firstname, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
