'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CategoriesTable } from './components/CategoriesTable'
import { CategoryForm } from './components/CategoryForm'
import { CategoryFilters } from './components/CategoryFilters'
import { Plus, Search, AlertTriangle } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify';

interface Category {
  id: string
  name: string
  description: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:3000/api/category')
        const data = await response.json()
        const categoryList = data.categories || []
        setCategories(categoryList)
        setFilteredCategories(categoryList)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Filter categories based on search
  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredCategories(filtered)
  }, [searchQuery, categories])

  const handleAddCategory = async (formData: { name: string; description: string }) => {
    try {
      const response = await fetch('http://localhost:3000/api/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newCategory = await response.json()
        setCategories([...categories, newCategory.category])
        setIsAddDialogOpen(false)
        toast.success('Category created successfully!')
      }
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error('Failed to create category')
    }
  }

  const handleUpdateCategory = async (formData: { name: string; description: string }) => {
    if (!selectedCategory) return

    try {
      const response = await fetch(
        `http://localhost:3000/api/category/${selectedCategory.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      if (response.ok) {
        const updatedCategory = await response.json()
        setCategories(
          categories.map((cat) =>
            cat.id === selectedCategory.id ? updatedCategory.category : cat
          )
        )
        setIsEditDialogOpen(false)
        setSelectedCategory(null)
        toast.success('Category updated successfully!')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
    }
  }

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    try {
      setIsDeleting(true);

      const response = await fetch(
        `http://localhost:3000/api/category/${selectedCategory.id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        // Server sent a custom error → Show it
        toast.error(data.error || "Failed to delete category");
        return;
      }

      // Success
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== selectedCategory.id)
      );

      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);

      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsViewDialogOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsEditDialogOpen(true)
  }

  const handleConfirmDelete = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Categories Management</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Create, update, and manage event categories
            </p>
          </div>

          {/* Add Category Button */}
          <div className="mb-6">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6 border-border bg-card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              {searchQuery && (
                <Button variant="outline" onClick={handleClearSearch} className="w-full sm:w-auto">
                  Clear
                </Button>
              )}
            </div>
          </Card>

          {/* Categories Table */}
          <CategoriesTable
            categories={filteredCategories}
            loading={loading}
            onView={handleViewCategory}
            onEdit={handleEditCategory}
            onDelete={handleConfirmDelete}
          />
        </div>

        {/* Add Category Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new event category for your platform
              </DialogDescription>
            </DialogHeader>
            <CategoryForm onSubmit={handleAddCategory} />
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the category details
              </DialogDescription>
            </DialogHeader>
            {selectedCategory && (
              <CategoryForm
                onSubmit={handleUpdateCategory}
                initialData={{
                  name: selectedCategory.name,
                  description: selectedCategory.description,
                }}
                isEditing
              />
            )}
          </DialogContent>
        </Dialog>

        {/* View Category Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-lg mx-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">{selectedCategory?.name}</DialogTitle>
              <DialogDescription>
                Category ID: {selectedCategory?.id}
              </DialogDescription>
            </DialogHeader>
            {selectedCategory && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">Description</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{selectedCategory.description}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsViewDialogOpen(false)
                      handleEditCategory(selectedCategory)
                    }}
                    className="w-full sm:w-auto"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setIsViewDialogOpen(false)
                      handleConfirmDelete(selectedCategory)
                    }}
                    className="w-full sm:w-auto"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <DialogTitle className="text-destructive">Delete Category</DialogTitle>
                </div>
              </div>
              <DialogDescription className="mt-4">
                Are you sure you want to delete <span className="font-semibold text-foreground">"{selectedCategory?.name}"</span>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteCategory}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
