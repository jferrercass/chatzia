"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, Clock } from "lucide-react"

interface FilePreviewData {
  name: string
  type: string
  size: string
  uploadDate: string
  lastUpdated: string
  content: string
}

interface FilePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  file: FilePreviewData | null
}

export function FilePreviewModal({ isOpen, onClose, file }: FilePreviewModalProps) {
  if (!file) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {file.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Badge variant="secondary">{file.type.toUpperCase()}</Badge>
              <span>{file.size}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Subido: {file.uploadDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Actualizado: {file.lastUpdated}</span>
            </div>
          </div>

          {/* File Content Preview */}
          <div className="border rounded-lg p-4 max-h-96 overflow-y-auto bg-muted/30">
            <pre className="whitespace-pre-wrap text-sm font-mono">{file.content}</pre>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
