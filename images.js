import fs from 'fs';
import path from 'path';
import https from 'https';

const images = `
https://scontent-man2-1.cdninstagram.com/v/t51.2885-15/39964098_2246142898965934_6122057701445611010_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjEwODB4MTA4MC5zZHIuZjI4ODUuZGVmYXVsdF9pbWFnZS5jMiJ9&_nc_ht=scontent-man2-1.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2QGskP5aRv3DEqLTwW47ClM8ANHc0wVmsuD4rB-kkGtXqtfY0XLHVhLrmQOov_NjF8U&_nc_ohc=h5Rfqe_JM5oQ7kNvwGDh0VO&_nc_gid=EdDqTD4oU_9IwVYl9ZyeIg&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MTg2MTk1NDcyODMzMDU3MTgzMw%3D%3D.3-ccb7-5&oh=00_AfzSA3Kto6W1D5rOJCz9arJicO9nB1eHEoeny5eQe7ccxA&oe=69ACE634&_nc_sid=10d13b

https://scontent-man2-1.cdninstagram.com/v/t51.2885-15/40238036_155976851990002_2665772397288733127_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjEwODB4MTA4MC5zZHIuZjI4ODUuZGVmYXVsdF9pbWFnZS5jMiJ9&_nc_ht=scontent-man2-1.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2QGskP5aRv3DEqLTwW47ClM8ANHc0wVmsuD4rB-kkGtXqtfY0XLHVhLrmQOov_NjF8U&_nc_ohc=gOT8T5DecZoQ7kNvwGzfhra&_nc_gid=EdDqTD4oU_9IwVYl9ZyeIg&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MTg2MTk1NDcxOTMyOTYzMTU2Nw%3D%3D.3-ccb7-5&oh=00_AfxT4DUt3W-BWmY7_1vEijw_RJx-g-At3EPEBwHyi5u51A&oe=69ACCEFC&_nc_sid=10d13b

https://scontent-man2-1.cdninstagram.com/v/t51.2885-15/40051146_1977739955580794_5965215035809780608_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjEwODB4MTA4MC5zZHIuZjI4ODUuZGVmYXVsdF9pbWFnZS5jMiJ9&_nc_ht=scontent-man2-1.cdninstagram.com&_nc_cat=102&_nc_oc=Q6cZ2QGskP5aRv3DEqLTwW47ClM8ANHc0wVmsuD4rB-kkGtXqtfY0XLHVhLrmQOov_NjF8U&_nc_ohc=74oy0dEN1TgQ7kNvwFqHl77&_nc_gid=EdDqTD4oU_9IwVYl9ZyeIg&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MTg2MTk1NDcxNDM5NzMwNzYyNQ%3D%3D.3-ccb7-5&oh=00_AfyOTWxvYfvoOPPj3dSVNWHbigrsGSbKN1d3_rckmAN9PA&oe=69AD03BE&_nc_sid=10d13b

https://scontent-man2-1.cdninstagram.com/v/t51.2885-15/40078368_1917710334934895_2451709385299576892_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=MTg2MTk1NDcyNTc5NzIxNzI4Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTA4MC5zZHIuZGVmYXVsdF9pbWFnZS5DMyJ9&_nc_ohc=eJ3I7Z5AHrQQ7kNvwGhYk5L&_nc_oc=Adn8vp3rA7Y3FXXkFIfnNjyCzsibbHq3IknNL5cgmY5Z1r3SlCIpotJWDf7tYy_Ihfk&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-man2-1.cdninstagram.com&_nc_ss=8&oh=00_AfxghMw3-y-BOAFYNvV3mlQIjGKr6dCoFs4FMhnrELNWyA&oe=69ACDDC5

https://scontent-man2-1.cdninstagram.com/v/t51.2885-15/40483944_474023676417277_8558228137752967751_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjEwODB4MTA4MC5zZHIuZjI4ODUuZGVmYXVsdF9pbWFnZS5jMiJ9&_nc_ht=scontent-man2-1.cdninstagram.com&_nc_cat=101&_nc_oc=Q6cZ2QGskP5aRv3DEqLTwW47ClM8ANHc0wVmsuD4rB-kkGtXqtfY0XLHVhLrmQOov_NjF8U&_nc_ohc=VOG44_vqADMQ7kNvwFRJxrb&_nc_gid=EdDqTD4oU_9IwVYl9ZyeIg&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MTg2MTk1NDcyNDU3MjUwMDg0Ng%3D%3D.3-ccb7-5&oh=00_Afz7c2hnUScNXUvlz-AfO3x_etit0E_5FjZsu0X01fkCmw&oe=69ACF018&_nc_sid=10d13b

https://scontent-man2-1.cdninstagram.com/v/t51.2885-15/40005049_304448597025683_9078763135589272231_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=110&ig_cache_key=MTg2MTk1NDcyODAzNzAwMzc2OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTA4MC5zZHIuZGVmYXVsdF9pbWFnZS5DMyJ9&_nc_ohc=3zefYgKoPwYQ7kNvwGoD6Az&_nc_oc=AdlZwL0sDozsyEjstSQewKTQkjLYSXHvL0RjkhR7MgoFRVyuCc9OmW9rk-YoSP94MSA&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-man2-1.cdninstagram.com&_nc_ss=8&oh=00_Afx0gPJWPlBzR6ReSXZ7I8A0nJpCRWBqryiYfoi01thOZw&oe=69ACFA27

https://scontent-man2-1.cdninstagram.com/v/t51.2885-15/40220538_2240610516223013_8557506197343477978_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjEwODB4MTA4MC5zZHIuZjI4ODUuZGVmYXVsdF9pbWFnZS5jMiJ9&_nc_ht=scontent-man2-1.cdninstagram.com&_nc_cat=105&_nc_oc=Q6cZ2QGskP5aRv3DEqLTwW47ClM8ANHc0wVmsuD4rB-kkGtXqtfY0XLHVhLrmQOov_NjF8U&_nc_ohc=Lmoiv3Gg1mwQ7kNvwHCXL0U&_nc_gid=EdDqTD4oU_9IwVYl9ZyeIg&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MTg2MTk1NDY5NDQ1NzQ1NDYwMQ%3D%3D.3-ccb7-5&oh=00_AfyB9SKtBqj2lBRaFA5_lV53J6BZ6k_7oyiyHb9nvYjR9w&oe=69ACCFD9&_nc_sid=10d13b

https://scontent-man2-1.cdninstagram.com/v/t51.2885-15/40238036_155976851990002_2665772397288733127_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjEwODB4MTA4MC5zZHIuZjI4ODUuZGVmYXVsdF9pbWFnZS5jMiJ9&_nc_ht=scontent-man2-1.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2QGskP5aRv3DEqLTwW47ClM8ANHc0wVmsuD4rB-kkGtXqtfY0XLHVhLrmQOov_NjF8U&_nc_ohc=gOT8T5DecZoQ7kNvwGzfhra&_nc_gid=EdDqTD4oU_9IwVYl9ZyeIg&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MTg2MTk1NDcxOTMyOTYzMTU2Nw%3D%3D.3-ccb7-5&oh=00_AfxT4DUt3W-BWmY7_1vEijw_RJx-g-At3EPEBwHyi5u51A&oe=69ACCEFC&_nc_sid=10d13b

https://scontent-man2-1.cdninstagram.com/v/t51.2885-15/39964098_2246142898965934_6122057701445611010_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjEwODB4MTA4MC5zZHIuZjI4ODUuZGVmYXVsdF9pbWFnZS5jMiJ9&_nc_ht=scontent-man2-1.cdninstagram.com&_nc_cat=110&_nc_oc=Q6cZ2QGskP5aRv3DEqLTwW47ClM8ANHc0wVmsuD4rB-kkGtXqtfY0XLHVhLrmQOov_NjF8U&_nc_ohc=h5Rfqe_JM5oQ7kNvwGDh0VO&_nc_gid=EdDqTD4oU_9IwVYl9ZyeIg&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MTg2MTk1NDcyODMzMDU3MTgzMw%3D%3D.3-ccb7-5&oh=00_AfzSA3Kto6W1D5rOJCz9arJicO9nB1eHEoeny5eQe7ccxA&oe=69ACE634&_nc_sid=10d13b

https://scontent-man2-1.cdninstagram.com/v/t51.2885-15/40129218_427169167688073_3536759372216764501_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjEwODB4MTA4MC5zZHIuZjI4ODUuZGVmYXVsdF9pbWFnZS5jMiJ9&_nc_ht=scontent-man2-1.cdninstagram.com&_nc_cat=109&_nc_oc=Q6cZ2QGskP5aRv3DEqLTwW47ClM8ANHc0wVmsuD4rB-kkGtXqtfY0XLHVhLrmQOov_NjF8U&_nc_ohc=ZnLQazyK4X8Q7kNvwH63lR1&_nc_gid=EdDqTD4oU_9IwVYl9ZyeIg&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MTg2MTk1NDc1MTM3NDEzNTQwOQ%3D%3D.3-ccb7-5&oh=00_AfzlOcPiBrEC1A3tI6N-1VFcKg9Y344NX9sF1Wb65poQdw&oe=69ACF7E8&_nc_sid=10d13b

https://scontent-man2-1.cdninstagram.com/v/t51.2885-15/39952032_1010630145776147_8339683040802797175_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjEwODB4MTA4MC5zZHIuZjI4ODUuZGVmYXVsdF9pbWFnZS5jMiJ9&_nc_ht=scontent-man2-1.cdninstagram.com&_nc_cat=111&_nc_oc=Q6cZ2QGskP5aRv3DEqLTwW47ClM8ANHc0wVmsuD4rB-kkGtXqtfY0XLHVhLrmQOov_NjF8U&_nc_ohc=xYXko-rlJlEQ7kNvwFuwHDw&_nc_gid=EdDqTD4oU_9IwVYl9ZyeIg&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MTg2MTk1NDc2MTA0NjM0NTAxMQ%3D%3D.3-ccb7-5&oh=00_AfyZ61ySKzyK4KUIbRlFst-wrzFRB1fjYjweoX1LPVePYA&oe=69ACF791&_nc_sid=10d13b

`;

const imageUrls = images
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

function ensureImagesDir() {
  const dir = path.resolve(process.cwd(), 'images');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function downloadImage(url, index, outputDir) {
  return new Promise((resolve, reject) => {
    const makeFilename = () => {
      try {
        const u = new URL(url);
        const base = path.basename(u.pathname) || `image-${index + 1}.jpg`;
        const [name] = base.split('?');
        return name || `image-${index + 1}.jpg`;
      } catch {
        return `image-${index + 1}.jpg`;
      }
    };

    const filename = makeFilename();
    const filePath = path.join(outputDir, filename);

    const handleResponse = (res) => {
      if (
        res.statusCode &&
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        https
          .get(res.headers.location, handleResponse)
          .on('error', reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(() => resolve(filePath));
      });
      fileStream.on('error', reject);
    };

    https.get(url, handleResponse).on('error', reject);
  });
}

export async function downloadAllImages() {
  const outputDir = ensureImagesDir();
  await Promise.all(
    imageUrls.map((url, index) =>
      downloadImage(url, index, outputDir).catch((err) => {
        console.error(`Error downloading ${url}:`, err.message || err);
      })
    )
  );
}
downloadAllImages();