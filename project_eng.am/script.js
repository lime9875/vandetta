// إظهار نافذة الدردشة عند النقر على زر CTA
document.querySelector('.cta-button').addEventListener('click', () => {
    document.querySelector('.chat-window').style.display = 'flex';
});

// التعامل مع إرسال رسالة عند النقر على زر الإرسال
document.getElementById('send-button').addEventListener('click', () => {
    sendUserMessage();
});

// التعامل مع إرسال رسالة عند الضغط على زر Enter
document.getElementById('chat-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendUserMessage();
        event.preventDefault(); // لمنع إدخال سطر جديد في حقل الإدخال
    }
});

// دالة لإرسال رسالة المستخدم إلى الذكاء الاصطناعي
function sendUserMessage() {
    const userInput = document.getElementById('chat-input').value;
    if (userInput) {
        addMessageToChat('أنت: ' + userInput, 'user');
        document.getElementById('chat-input').value = '';
        sendMessageToAI(userInput);
    }
}

// دالة لإضافة الرسائل إلى جسم الدردشة
function addMessageToChat(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = sender;
    document.querySelector('.chat-body').appendChild(messageElement);
    document.querySelector('.chat-body').scrollTop = document.querySelector('.chat-body').scrollHeight;
}

// دالة لإرسال رسالة إلى الذكاء الاصطناعي والحصول على رد
async function sendMessageToAI(message) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer OPENAI_API_KEY', // استبدل OPENAI_API_KEY بمفتاح الـ API الخاص بك
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // استخدم النموذج المتاح لديك
                messages: [{ role: "user", content: message }],
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            const aiResponse = data.choices[0].message.content;
            addMessageToChat('الذكاء الاصطناعي: ' + aiResponse, 'ai');
        } else {
            addMessageToChat('لم يتم العثور على رد من الذكاء الاصطناعي', 'ai');
        }
    } catch (error) {
        addMessageToChat('حدث خطأ أثناء الاتصال بالذكاء الاصطناعي: ' + error.message, 'ai');
        console.error('Error:', error);
    }
}
