"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "../firebase";
import {
  Box,
  Modal,
  Typography,
  Stack,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
} from "firebase/firestore";
import SearchIcon from "@mui/icons-material/Search";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory
    .filter(({ name }) =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (filterOption === "name") {
        return a.name.localeCompare(b.name);
      } else if (filterOption === "HIGH_TO_LOW") {
        return b.quantity - a.quantity;
      } else if (filterOption === "LOW_TO_HIGH") {
        return a.quantity - b.quantity;
      }
      return 0;
    });

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        background: "radial-gradient(circle, #bec6f9, #aeb8f8,#8492f1,  #9ba7f3, #7686ef)", 
      }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="#c8cffa"
          border="2px solid black"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)",
          }}
          
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              sx={{ backgroundColor: "#536dfe", color: "#fff" }} // Updated button color
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button
        variant="contained"
        sx={{ backgroundColor: "#536dfe", color: "#fff" }} // Updated button color
        onClick={() => {
          handleOpen();
        }}
      >
        Add new Item
      </Button>
      <Box border="1px solid black">
        <Box
          width="800px"
          height="100px"
          bgcolor="#c8cffa"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderBottom="1px solid black"
        >
          <Typography variant="h2" color="#333">
            Pantry Items
          </Typography>
        </Box>
        <Box width="800px" mb={2} mt={2} pl={2} pr={2}>
          <TextField
            variant="outlined"
            fullWidth
            
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          
        >
          <FormControl variant="outlined" sx={{ minWidth: 200, mb: 2 }}>
            <InputLabel id="filter-label">Filter by Category</InputLabel>
            <Select
              labelId="filter-label"
              value={filterOption}
              onChange={handleFilterChange}
              label="Filter by Category"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="name">Name (A - Z)</MenuItem>
              <MenuItem value="HIGH_TO_LOW">Quantity (High to Low)</MenuItem>
              <MenuItem value="LOW_TO_HIGH">Quantity (Low to High)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Stack width="800px" height="300px" overflow="auto">
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="120px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#c8cffa"
              padding={5}
              borderBottom="1px solid black"
              borderTop="1px solid black"
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(name);
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    removeItem(name);
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
