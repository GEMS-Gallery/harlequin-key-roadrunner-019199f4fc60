import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';
import { Box, Container, Grid, Typography, TextField, Button, List, ListItem, ListItemText, Paper } from '@mui/material';

type Category = {
  id: bigint;
  name: string;
};

type Note = {
  id: bigint;
  title: string;
  content: string | null;
  categoryId: bigint | null;
};

const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<bigint | null>(null);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchCategories();
    fetchNotes();
  }, []);

  const fetchCategories = async () => {
    const result = await backend.getCategories();
    setCategories(result);
  };

  const fetchNotes = async () => {
    const result = await backend.getNotes();
    setNotes(result);
  };

  const onAddCategory = async (data: { categoryName: string }) => {
    const result = await backend.addCategory(data.categoryName);
    if ('ok' in result) {
      fetchCategories();
      reset({ categoryName: '' });
    } else {
      console.error('Failed to add category:', result.err);
    }
  };

  const onAddNote = async (data: { title: string; content: string }) => {
    const result = await backend.addNote(data.title, data.content ? [data.content] : [], selectedCategory ? [selectedCategory] : []);
    if ('ok' in result) {
      fetchNotes();
      reset({ title: '', content: '' });
    } else {
      console.error('Failed to add note:', result.err);
    }
  };

  const onSelectCategory = async (categoryId: bigint | null) => {
    setSelectedCategory(categoryId);
    if (categoryId !== null) {
      const categoryNotes = await backend.getNotesByCategory(categoryId);
      setNotes(categoryNotes);
    } else {
      fetchNotes();
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ flexGrow: 1, mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Categories
              </Typography>
              <form onSubmit={handleSubmit(onAddCategory)}>
                <Controller
                  name="categoryName"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Category name is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="New Category"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Add Category
                </Button>
              </form>
              <List>
                <ListItem
                  button
                  selected={selectedCategory === null}
                  onClick={() => onSelectCategory(null)}
                >
                  <ListItemText primary="All Categories" />
                </ListItem>
                {categories.map((category) => (
                  <ListItem
                    key={category.id.toString()}
                    button
                    selected={selectedCategory === category.id}
                    onClick={() => onSelectCategory(category.id)}
                  >
                    <ListItemText primary={category.name} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={9}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Msgs
              </Typography>
              <form onSubmit={handleSubmit(onAddNote)}>
                <Controller
                  name="title"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Title is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Note Title"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
                <Controller
                  name="content"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Note Content"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      multiline
                      rows={4}
                    />
                  )}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Add Note
                </Button>
              </form>
              <List>
                {notes.map((note) => (
                  <ListItem key={note.id.toString()}>
                    <ListItemText
                      primary={note.title}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="textPrimary">
                            {categories.find(c => c.id === note.categoryId)?.name || 'Uncategorized'}
                          </Typography>
                          <br />
                          {note.content || 'No content'}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default App;
