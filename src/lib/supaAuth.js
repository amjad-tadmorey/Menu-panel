import { supabase } from "./supabase";

export async function handleUserCreation({ email, password, role, shop }) {
    try {
        // 1. Sign up the user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    role,
                    shop_id: shop,
                },
            },
        });

        if (signUpError) {
            console.error("Signup error:", signUpError.message);
            return { success: false, message: signUpError.message };
        }

        const newUser = signUpData.user;

        if (!newUser) {
            console.error("Signup succeeded, but user data is missing.");
            return { success: false, message: "User creation failed" };
        }

        // 2. Update profiles table
        const { error: updateError } = await supabase
            .from("profiles")
            .update({
                email,
                shop_id: shop,
                role,
            })
            .eq("id", newUser.id);

        if (updateError) {
            console.error("Error updating profile:", updateError.message);
            return { success: false, message: updateError.message };
        }

        // 3. Fetch current users count
        const { data: shopData, error: fetchError } = await supabase
            .from("shops")
            .select("users")
            .eq("id", shop)
            .single();

        if (fetchError || !shopData) {
            console.error("Error fetching current users count:", fetchError?.message);
            return { success: false, message: "User created, but failed to fetch shop data" };
        }

        const currentUsers = shopData.users || 0;

        // 4. Increment and update users count
        const { error: incrementError } = await supabase
            .from("shops")
            .update({ users: currentUsers + 1 })
            .eq("id", shop);

        if (incrementError) {
            console.error("Error incrementing users count:", incrementError.message);
            return { success: false, message: "User created, but failed to update shop user count" };
        }

        console.log("User created, profile updated, and shop users count incremented.");
        return { success: true, user: newUser };

    } catch (err) {
        console.error("Unexpected error:", err);
        return { success: false, message: "Unexpected error occurred" };
    }
}
