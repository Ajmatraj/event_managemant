import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Eye, Edit, Trash2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
}

interface CategoriesTableProps {
  categories: Category[]
  loading: boolean
  onView: (category: Category) => void
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoriesTable({
  categories,
  loading,
  onView,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  if (loading) {
    return (
      <Card className="border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">Loading categories...</p>
      </Card>
    )
  }

  if (categories.length === 0) {
    return (
      <Card className="border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No categories found</p>
      </Card>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <Card className="border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground">Name</TableHead>
              <TableHead className="text-foreground hidden sm:table-cell">Description</TableHead>
              <TableHead className="text-right text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="border-border hover:bg-muted/50">
                <TableCell className="font-medium text-foreground">{category.name}</TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground hidden sm:table-cell">
                  {category.description}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 sm:gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(category)}
                      className="hover:bg-muted hover:text-foreground"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(category)}
                      className="hover:bg-muted hover:text-foreground"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(category)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
