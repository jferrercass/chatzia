"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { FileText, MoreHorizontal, Eye, Trash2, Calendar } from "lucide-react"

interface FileItemData {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  lastUpdated: string
  content: string
}

interface FileItemProps {
  file: FileItemData
  isSelected: boolean
  onSelect: (id: string, selected: boolean) => void
  onPreview: (file: FileItemData) => void
  onDelete: (id: string) => void
}

export function FileItem({ file, isSelected, onSelect, onPreview, onDelete }: FileItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
      <Checkbox checked={isSelected} onCheckedChange={(checked) => onSelect(file.id, !!checked)} />

      <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium truncate">{file.name}</span>
          <Badge variant="secondary" className="text-xs">
            {file.type.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{file.size}</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{file.uploadDate}</span>
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            aria-label={`Opciones para ${file.name}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onPreview(file)}>
            <Eye className="h-4 w-4 mr-2" />
            Vista previa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(file.id)} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
