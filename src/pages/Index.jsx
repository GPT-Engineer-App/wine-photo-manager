import React, { useState, useEffect } from "react";
import { Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, List, ListItem, Stack, Text, Image, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wineBottles, setWineBottles] = useState([]);
  const [newWineTitle, setNewWineTitle] = useState("");
  const [newWineDescription, setNewWineDescription] = useState("");
  const [winePhoto, setWinePhoto] = useState(null);
  const toast = useToast();

  const apiUrl = "https://backengine-dy6a.fly.dev";

  // Authentication handlers
  const handleSignup = async () => {
    try {
      const response = await fetch(`${apiUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        toast({ title: "Signup successful", status: "success" });
        handleLogin(); // Directly login after signup
      } else {
        toast({ title: "Signup failed", status: "error" });
      }
    } catch (error) {
      toast({ title: "Error signing up", status: "error" });
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setIsLoggedIn(true);
        toast({ title: "Login successful", status: "success" });
        fetchWineBottles();
      } else {
        toast({ title: "Login failed", status: "error" });
      }
    } catch (error) {
      toast({ title: "Error logging in", status: "error" });
    }
  };

  // Fetch wine bottles
  const fetchWineBottles = async () => {
    try {
      const response = await fetch(`${apiUrl}/wine_bottles`);
      const data = await response.json();
      setWineBottles(data || []);
    } catch (error) {
      toast({ title: "Error fetching wine bottles", status: "error" });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchWineBottles();
    }
  }, [isLoggedIn]);

  // Add a new wine bottle
  const handleAddWineBottle = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newWineTitle);
      formData.append("description", newWineDescription);
      formData.append("photo", winePhoto);

      const response = await fetch(`${apiUrl}/wine_bottles`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setNewWineTitle("");
        setNewWineDescription("");
        setWinePhoto(null);
        toast({ title: "Wine bottle added successfully", status: "success" });
        fetchWineBottles();
      } else {
        toast({ title: "Failed to add wine bottle", status: "error" });
      }
    } catch (error) {
      toast({ title: "Error adding wine bottle", status: "error" });
    }
  };

  // Delete a wine bottle
  const handleDeleteWineBottle = async (title) => {
    try {
      const response = await fetch(`${apiUrl}/wine_bottles/${encodeURIComponent(title)}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({ title: "Wine bottle deleted successfully", status: "success" });
        fetchWineBottles();
      } else {
        toast({ title: "Failed to delete wine bottle", status: "error" });
      }
    } catch (error) {
      toast({ title: "Error deleting wine bottle", status: "error" });
    }
  };

  if (!isLoggedIn) {
    return (
      <Container centerContent>
        <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
          <Stack spacing={4}>
            <Heading textAlign="center">Wine Management App</Heading>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Button onClick={handleSignup}>Signup</Button>
            <Button onClick={handleLogin}>Login</Button>
          </Stack>
        </Box>
      </Container>
    );
  }

  return (
    <Container centerContent>
      <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
        <Stack spacing={4}>
          <Heading textAlign="center">Wine Inventory</Heading>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input type="text" value={newWineTitle} onChange={(e) => setNewWineTitle(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input type="text" value={newWineDescription} onChange={(e) => setNewWineDescription(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Photo</FormLabel>
            <Input type="file" onChange={(e) => setWinePhoto(e.target.files[0])} />
          </FormControl>
          <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={handleAddWineBottle}>
            Add Wine Bottle
          </Button>
          <List spacing={3}>
            {Array.isArray(wineBottles) &&
              wineBottles.map((wine) => (
                <ListItem key={wine.title}>
                  <Flex align="center" justify="space-between">
                    <Box>
                      <Text fontWeight="bold">{wine.title}</Text>
                      <Text fontSize="sm">{wine.description}</Text>
                    </Box>
                    <Image src={wine.photo} alt={wine.title} maxWidth="100px" maxHeight="100px" />
                    <Button leftIcon={<FaTrash />} colorScheme="red" onClick={() => handleDeleteWineBottle(wine.title)}>
                      Delete
                    </Button>
                  </Flex>
                </ListItem>
              ))}
          </List>
        </Stack>
      </Box>
    </Container>
  );
};

export default Index;
