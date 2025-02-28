// app/(protected)/layout.tsx
import { useAuth } from '@/hooks/auth-context';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const UserProfile = () => {
    const { isAuthenticated, userProfile, logout } = useAuth();
    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                {userProfile?.image ? (
                    <Image
                        source={{ uri: userProfile.image }}
                        style={styles.avatar}
                        onError={(error) => console.log("Image load error:", error)}
                    />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                            {userProfile?.username?.charAt(0) || "U"}
                        </Text>
                    </View>
                )}
                <Text style={styles.username}>
                    {userProfile?.username || "Unknown User"}
                </Text>
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.detailLabel}>ID:</Text>
                <Text style={styles.detailValue}>{userProfile?.id || ""}</Text>

                <Text style={styles.detailLabel}>Tài Khoản:</Text>
                <Text style={styles.detailValue}>{userProfile?.username || ""}</Text>

                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{userProfile?.email || ""}</Text>

                <Text style={styles.detailLabel}>Tên:</Text>
                <Text style={styles.detailValue}>{userProfile?.firstName && userProfile?.lastName || ""}</Text>

                <Text style={styles.detailLabel}>Giới Tính:</Text>
                <Text style={styles.detailValue}>{userProfile?.gender || ""}</Text>
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={logout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5", // Light background for a clean look
        padding: 20,
    },
    profileHeader: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50, // Circular avatar
        borderWidth: 2,
        borderColor: "#007AFF", // Blue border for a modern touch
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#007AFF", // Blue background for placeholder
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: "white",
        fontSize: 40,
        fontWeight: "bold",
    },
    username: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginTop: 10,
    },
    detailsContainer: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
        marginBottom: 20,
    },
    detailLabel: {
        fontSize: 16,
        color: "#666",
        marginBottom: 5,
    },
    detailValue: {
        fontSize: 18,
        color: "#333",
        marginBottom: 15,
    },
    logoutButton: {
        backgroundColor: "#FF4444", // Red for logout button
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
    },
    logoutButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default UserProfile;