import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';

export function Modal({trigger, content}: any) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open}>
      <Dialog.Trigger asChild onClick={() => setOpen(!open)}>
          {trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="transition-all  data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="sm:max-w-[425px]">
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Description>
            Make changes to your profile here. Click save when you're done.
            </Dialog.Description>
            <div className="grid gap-4 py-4">

                {content}

                <Dialog.Close asChild>
                    <button
                        className=" absolute top-[10px] right-[10px] inline-flex h-[20px] w-[20px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                        aria-label="Close"
                    >
                      x
                    </button>
                </Dialog.Close>
            </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
