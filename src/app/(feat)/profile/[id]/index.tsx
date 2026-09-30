import Navhost from "@/components/navhost";
import { Button } from "@/components/ui";
import Header from "@/components/ui/header";
import { Image, Text, View } from "react-native";
import { ArrowLeftIcon } from "@solar-icons/react-native/icons/linear/arrow-left";

export default function Profile() {



    return (
        <>
            <View className="h-14 justify-between flex-row items-center border-b border-b-border px-4">
                <Button
                    icon
                    size="default"
                    variant={"ghost"}
                    leadingIcon={<ArrowLeftIcon size={16} />} />
                <Text className="font-semibold text-xl text-foreground">Trang cá nhân</Text>
                <Button icon size="default" variant={"ghost"} />
            </View>
            <View className="flex-1 p-4">
                <View className="flex-row gap-4">
                    <View>
                        <Image
                            className="size-20 rounded-full"
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150">
                        </Image>
                    </View>
                    <View className="justify-center">
                        <Text className="text-xl font-semibold">Username</Text>
                        <Text className="text-base">username@gmail.com</Text>
                    </View>
                </View>
            </View>

            <Navhost />
        </>
    )
}