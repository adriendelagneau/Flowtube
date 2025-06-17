import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  title: string;
  footer?: React.ReactNode; // better typed than string
  onOpenChange: (open: boolean) => void;
}

export const AuthModal = ({
  children,
  open,
  title,
  footer,
  onOpenChange,
}: ResponsiveModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {children}

        {footer && <DialogFooter >{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};
