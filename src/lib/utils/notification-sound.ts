/**
 * Notification sound utilities using Web Audio API
 * Works in PWA without requiring sound files
 */

// Play a pleasant notification sound
export function playNotificationSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    const playTone = (frequency: number, startTime: number, duration: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = "sine";

      // Fade in and out for a smoother sound
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = audioContext.currentTime;
    // Two ascending tones (gentle "ding-ding")
    playTone(880, now, 0.15); // A5
    playTone(1108, now + 0.15, 0.2); // C#6

    setTimeout(() => audioContext.close(), 500);
  } catch (error) {
    console.debug("Could not play notification sound:", error);
  }
}

// Play a more urgent sound for new kitchen orders
export function playNewOrderSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    const playTone = (frequency: number, startTime: number, duration: number, volume: number = 0.3) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.03);
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = audioContext.currentTime;
    // Three-tone alert (more noticeable for kitchen)
    playTone(659, now, 0.12, 0.35);        // E5
    playTone(784, now + 0.12, 0.12, 0.35); // G5
    playTone(988, now + 0.24, 0.18, 0.35); // B5

    setTimeout(() => audioContext.close(), 600);
  } catch (error) {
    console.debug("Could not play new order sound:", error);
  }
}
