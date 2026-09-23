# שימוש בגרסת Node.js רשמית ויציבה
FROM node:22-alpine

# הגדרת תיקיית העבודה בתוך הקונטיינר
WORKDIR /app

# העתקת קבצי התלות והתקנתם
COPY package*.json ./
RUN npm install

# העתקת שאר קבצי הפרויקט לפרויקט
COPY . .

# פתיחת הפורט שבו השרת רץ
EXPOSE 3000

# פקודת ההפעלה של השרת
CMD ["node", "index.js"]