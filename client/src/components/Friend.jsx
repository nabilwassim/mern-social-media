// ملف فريند كومبوننت دا هستخدمه فوق البوستات و العمود الاول من ع اليمين ف ليستة الاصدقاء

import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  // const primaryLight = palette.primary.light;
  // const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  // we want to check if the user is a friend 
  // لانه لو صديق عاوزين نظهر ايقونة بحيث نقدر منها نمسح الصديق دا والعكس صحيح
  const isFriend = friends.find((friend) => friend._id === friendId);

  // api call to add a friend oe not 
  // لو ضغط اضافة لصديق يظهر ف ليستة اصدقائي ولو مسحته يتشال منها
  const patchFriend = async () => {
    const response = await fetch(
      // _id = user id , friend id 
      `https://mern-social-media-twuu.onrender.com/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            // a bug here is that when you go to the user and you 
            // go to a certain person's progile page 
            // and try to click on someone else 's profile page
            // and try to go to that user , the url does update with react routerbut the components
            // doesn't re render
          
            // navigate(`/profile/${friendId}`);
            // solution: goes to next user's page and will refesh the page by navigate(0)
            // navigate(0);
            navigate("/home");
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton
        onClick={() => patchFriend()}
        sx={{ 
          backgroundColor: palette.primary.main, p: "0.6rem",}}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: palette.primary.icon, "&:hover": { color: palette.primary.main } }} />
        ) : (
          <PersonAddOutlined sx={{ color: palette.primary.icon, "&:hover": { color: palette.primary.main } }} />
        )}
      </IconButton>
    </FlexBetween>
  );
};

export default Friend;
