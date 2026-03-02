import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function hasValidSupabaseConfig(url, key) {
    if (!url || !key) return false;
    if (url.includes('xyzcompany.supabase.co')) return false;
    if (key === 'public-anon-key') return false;
    return true;
}

let warnedMissingConfig = false;
export const supabase = hasValidSupabaseConfig(supabaseUrl, supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

function warnMissingSupabaseConfig() {
    if (warnedMissingConfig) return;
    warnedMissingConfig = true;
    console.warn('Supabase is disabled: missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export async function initSupabase() {
    if (!supabase) {
        warnMissingSupabaseConfig();
        return null;
    }

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Error getting session:', error);
        return null;
    }

    if (session?.user) {
        console.log('User is logged in:', session.user.email);

        // Fetch user progress
        const { data, error: profileError } = await supabase
            .from('profiles')
            .select('stars')
            .eq('id', session.user.id)
            .single();

        if (profileError) {
            console.error('Error fetching profile:', profileError);
        } else if (data) {
            const starsEl = document.getElementById('stars-count');
            if (starsEl) {
                starsEl.innerText = data.stars || 0;
                if (data.stars > 0 && starsEl.parentElement) {
                    starsEl.parentElement.classList.remove('hidden');
                }
            }
        }
    } else {
        console.log('Supabase initialized (No active session)');
    }

    return session;
}

export async function addStar() {
    const starsEl = document.getElementById('stars-count');
    let currentStars = 0;

    if (starsEl) {
        const prior = Number.parseInt(starsEl.innerText, 10);
        currentStars = Number.isFinite(prior) ? prior + 1 : 1;
        starsEl.innerText = currentStars;
        if (starsEl.parentElement) {
            starsEl.parentElement.classList.remove('hidden');
        }
    }

    if (!supabase) {
        warnMissingSupabaseConfig();
        checkStarMilestones(currentStars);
        return;
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: session.user.id,
                stars: currentStars,
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error('Error saving stars to Supabase:', error);
        } else {
            console.log('Stars saved successfully!');
            checkStarMilestones(currentStars);
        }
    } else {
        console.log('Star added locally (No user session)');
        checkStarMilestones(currentStars);
    }
}

function checkStarMilestones(stars) {
    const levelUpOverlay = document.getElementById('level-up-overlay');
    const milestoneStars = document.getElementById('milestone-stars');
    const badgeDisplay = document.getElementById('badge-display');
    const closeBtn = document.getElementById('close-level-up');

    if (!levelUpOverlay || !milestoneStars || !badgeDisplay || !closeBtn) return;

    // Trigger level up at 10, 25, 50, 100 stars
    const milestones = [10, 25, 50, 100];
    if (milestones.includes(stars)) {
        milestoneStars.innerText = stars;

        // Change badge based on milestone
        switch (stars) {
            case 10: badgeDisplay.innerText = '🥉'; break;
            case 25: badgeDisplay.innerText = '🥈'; break;
            case 50: badgeDisplay.innerText = '🥇'; break;
            case 100: badgeDisplay.innerText = '👑'; break;
        }

        levelUpOverlay.classList.remove('hidden');

        // Add a "bouncing" class to the button
        const starsEl = document.getElementById('stars-count');
        if (starsEl && starsEl.parentElement) starsEl.parentElement.classList.add('bouncing');
        setTimeout(() => {
            if (starsEl && starsEl.parentElement) starsEl.parentElement.classList.remove('bouncing');
        }, 1000);

        closeBtn.onclick = () => {
            levelUpOverlay.classList.add('hidden');
        };
    }
}
