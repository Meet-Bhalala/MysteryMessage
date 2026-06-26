'use client';

import React from "react";
import {
    Card,
    CardHeader,
    CardDescription,
    CardContent,
} from '@/components/ui/card';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: any) => void;
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
            if (response.data.success) {
                toast.success(response.data.message || "Message deleted");
                onMessageDelete(message._id);
            } else {
                toast.error(response.data.message || "Failed to delete message");
            }
        } catch (error) {
            console.error("Failed to delete message", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data?.message || "Failed to delete message");
        }
    }

    return (
        <Card className="border border-neutral-100 shadow-sm bg-white hover:shadow-md transition-all duration-200 hover:border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900/50">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                        {message.createdAt ? new Date(message.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : 'Anonymous Message'}
                    </span>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button 
                                variant="destructive" 
                                size="icon-sm" 
                                className="h-7 w-7 rounded-lg opacity-70 hover:opacity-100 cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-lg font-bold text-neutral-800 dark:text-white">
                                    Delete this message?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-neutral-500 dark:text-neutral-400">
                                    This action cannot be undone. This will permanently delete this anonymous message from your dashboard.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-2">
                                <AlertDialogCancel className="cursor-pointer border-neutral-200">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={handleDeleteConfirm} 
                                    className="bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
            <CardContent className="pb-4 pt-1">
                <p className="text-sm font-medium leading-relaxed text-neutral-800 dark:text-neutral-200 break-words whitespace-pre-wrap">
                    {message.content}
                </p>
            </CardContent>
        </Card>
    )
}

export default MessageCard;