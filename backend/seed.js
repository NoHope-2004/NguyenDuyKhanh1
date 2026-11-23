require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Cart = require('./models/Cart');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vlxd-hub';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('Cleaning existing Categories, Products, and Demo Users...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({ email: { $in: ['demo@vlxdhub.vn', 'admin@vlxdhub.vn'] } });

    // 1. Seed Categories (8 categories)
    console.log('Seeding 8 Categories...');
    const categoriesData = [
      {
        name: 'Xi măng',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80',
      },
      {
        name: 'Sắt thép',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
      },
      {
        name: 'Gạch xây',
        image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=400&q=80',
      },
      {
        name: 'Gạch ốp lát',
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80',
      },
      {
        name: 'Cát đá',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
      },
      {
        name: 'Sơn xây dựng',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80',
      },
      {
        name: 'Ống nước & Phụ kiện',
        image: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=400&q=80',
      },
      {
        name: 'Chống thấm & Hóa chất',
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80',
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach((c) => {
      catMap[c.name] = c._id;
    });

    // 2. Seed Products (26 products across categories)
    console.log('Seeding 26 Building Material Products...');
    const productsData = [
      // Xi măng
      {
        name: 'Xi măng Hà Tiên Đa Dụng PCB40',
        categoryId: catMap['Xi măng'],
        brand: 'Hà Tiên',
        price: 92000,
        unit: 'Bao (50kg)',
        stock: 500,
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80',
        description: 'Xi măng Poóc lăng hỗn hợp PCB40 Hà Tiên dùng cho công tác đổ bê tông, móng, dầm, cột và xây tô công trình dân dụng chất lượng cao.',
      },
      {
        name: 'Xi măng INSEE Wall Pro Chuyên Xây Tô',
        categoryId: catMap['Xi măng'],
        brand: 'INSEE',
        price: 88000,
        unit: 'Bao (50kg)',
        stock: 350,
        image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&q=80',
        description: 'Công thức cải tiến giúp vữa dẻo mịn vượt trội, bám dính cực tốt, chống rạn nứt tường xây tô.',
      },
      {
        name: 'Xi măng Nghi Sơn PCB40 Bền Sunfat',
        categoryId: catMap['Xi măng'],
        brand: 'Nghi Sơn',
        price: 95000,
        unit: 'Bao (50kg)',
        stock: 200,
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80',
        description: 'Khả năng chịu mặn, chịu phèn cao, phù hợp cho vùng ngập mặn và nền móng công trình kiên cố.',
      },

      // Sắt thép
      {
        name: 'Thép cây vằn Hòa Phát Phi 16 (CB300)',
        categoryId: catMap['Sắt thép'],
        brand: 'Hòa Phát',
        price: 265000,
        unit: 'Thanh (11.7m)',
        stock: 800,
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
        description: 'Thép thanh vằn đường kính D16mm tiêu chuẩn quốc gia CB300, chịu lực kéo uốn cốt thép móng, dầm và cột bê tông cốt thép.',
      },
      {
        name: 'Thép cây vằn Hòa Phát Phi 12 (CB300)',
        categoryId: catMap['Sắt thép'],
        brand: 'Hòa Phát',
        price: 152000,
        unit: 'Thanh (11.7m)',
        stock: 600,
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
        description: 'Thép cốt bê tông D12mm chính hãng Hòa Phát, độ bền cơ học cao, chuẩn kích thước và gờ bám dính bê tông.',
      },
      {
        name: 'Thép cuộn Pomina Phi 6',
        categoryId: catMap['Sắt thép'],
        brand: 'Pomina',
        price: 16500,
        unit: 'Kg',
        stock: 5000,
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
        description: 'Thép cuộn trơn tròn D6 dùng làm đai móng cột, dầm đà và gia cố sàn nhà.',
      },
      {
        name: 'Thép hộp mạ kẽm Hoa Sen 40x80x1.4mm',
        categoryId: catMap['Sắt thép'],
        brand: 'Hoa Sen',
        price: 245000,
        unit: 'Cây (6m)',
        stock: 250,
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
        description: 'Thép hộp mạ kẽm chống rỉ sét ngoài trời, độ bền cao, dùng làm khung kèo mái, lan can, hàng rào.',
      },

      // Gạch xây
      {
        name: 'Gạch Tuynel 4 Lỗ Bình Dương (8x8x18cm)',
        categoryId: catMap['Gạch xây'],
        brand: 'Bình Dương Tuynel',
        price: 1350,
        unit: 'Viên',
        stock: 20000,
        image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&q=80',
        description: 'Gạch đất sét nung lò tuynel tiêu chuẩn cách nhiệt, cách âm tốt, độ nén chịu lực đạt chuẩn xây tường nhà ở.',
      },
      {
        name: 'Gạch đinh đặc Tuynel (4x8x18cm)',
        categoryId: catMap['Gạch xây'],
        brand: 'Đồng Nai',
        price: 1550,
        unit: 'Viên',
        stock: 15000,
        image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&q=80',
        description: 'Gạch đặc nung già chịu lực cao, thích hợp xây móng chống thấm, xây hầm tự hoại và chân tường chịu ẩm.',
      },
      {
        name: 'Gạch bê tông nhẹ AAC Khí Chưng Áp 100x200x600mm',
        categoryId: catMap['Gạch xây'],
        brand: 'Viglacera',
        price: 28000,
        unit: 'Viên',
        stock: 3000,
        image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&q=80',
        description: 'Gạch nhẹ cách nhiệt chống cháy đỉnh cao, giảm tải trọng công trình lên móng, thi công nhanh gấp 3 lần.',
      },

      // Gạch ốp lát
      {
        name: 'Gạch lát nền Viglacera Vân Đá 60x60cm (Hộp 4 viên)',
        categoryId: catMap['Gạch ốp lát'],
        brand: 'Viglacera',
        price: 185000,
        unit: 'Thùng (1.44m2)',
        stock: 400,
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80',
        description: 'Gạch xương bán sứ phủ men bóng kính, hoa văn vân đá cẩm thạch sang trọng chống trầy xước phòng khách.',
      },
      {
        name: 'Gạch ốp tường Prime Men Mờ 30x60cm',
        categoryId: catMap['Gạch ốp lát'],
        brand: 'Prime',
        price: 160000,
        unit: 'Thùng (1.44m2)',
        stock: 300,
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80',
        description: 'Gạch ốp men mờ hiện đại chống bám bẩn, dễ lau chùi, chuyên dụng cho nhà tắm, nhà vệ sinh và tường bếp.',
      },
      {
        name: 'Gạch Mosaic Lục Giác Trắng Vân Mây ốp trang trí',
        categoryId: catMap['Gạch ốp lát'],
        brand: 'Eurotile',
        price: 320000,
        unit: 'M2',
        stock: 120,
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80',
        description: 'Gạch trang trí tạo điểm nhấn phong cách tối giản Bắc Âu cho quầy bar, nhà tắm resort.',
      },

      // Cát đá
      {
        name: 'Cát vàng hạt lớn xây tô đổ bê tông',
        categoryId: catMap['Cát đá'],
        brand: 'Cát Sông Đồng Nai',
        price: 380000,
        unit: 'Mét khối (m3)',
        stock: 100,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
        description: 'Cát sàng sạch không lẫn tạp chất, mô đun hạt lớn đạt tiêu chuẩn bê tông dầm sàn cường độ cao.',
      },
      {
        name: 'Cát xây tô hạt mịn',
        categoryId: catMap['Cát đá'],
        brand: 'Cát Sông Miền Đông',
        price: 270000,
        unit: 'Mét khối (m3)',
        stock: 80,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
        description: 'Cát mịn đã đãi lọc tạp chất, giúp vữa trát tường láng mịn, phẳng đẹp và không nứt nẻ.',
      },
      {
        name: 'Đá 1x2 Xanh Biên Hòa Đổ Bê Tông',
        categoryId: catMap['Cát đá'],
        brand: 'Hóa An',
        price: 430000,
        unit: 'Mét khối (m3)',
        stock: 150,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
        description: 'Đá xanh khai thác từ mỏ đá Hóa An cứng cáp, hạt đều, độ chịu nén cực lớn cho mác bê tông từ 250 trở lên.',
      },
      {
        name: 'Đá 4x6 Làm Móng Công Trình',
        categoryId: catMap['Cát đá'],
        brand: 'Đá Miền Đông',
        price: 350000,
        unit: 'Mét khối (m3)',
        stock: 120,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
        description: 'Đá chẻ kích thước 4x6 dùng đổ bê tông lót móng, kè đắp nền chống sụt lún công trình.',
      },

      // Sơn xây dựng
      {
        name: 'Sơn nội thất cao cấp Dulux EasyClean Lau Chùi Hiệu Quả',
        categoryId: catMap['Sơn xây dựng'],
        brand: 'Dulux',
        price: 1250000,
        unit: 'Thùng (15 Lít)',
        stock: 90,
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80',
        description: 'Công nghệ KidProof chống bám vết bẩn, dễ lau chùi bề mặt tường, màu sắc bền đẹp không mùi độc hại.',
      },
      {
        name: 'Sơn ngoại thất chống thấm Jotun Jotashield Bền Màu Tối Ưu',
        categoryId: catMap['Sơn xây dựng'],
        brand: 'Jotun',
        price: 1850000,
        unit: 'Thùng (15 Lít)',
        stock: 65,
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80',
        description: 'Chống tia UV gấp 2 lần, chống rong rêu nấm mốc và giảm nhiệt hấp thu cho ngôi nhà dưới nắng hè nhiệt đới.',
      },
      {
        name: 'Bột bả trét tường ngoài trời Việt Mỹ (Bao 40kg)',
        categoryId: catMap['Sơn xây dựng'],
        brand: 'Việt Mỹ',
        price: 145000,
        unit: 'Bao (40kg)',
        stock: 300,
        image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=600&q=80',
        description: 'Bột trét tường dẻo quánh, độ bám dính chắc chắn, làm phẳng mịn bề mặt tường trước khi sơn phủ.',
      },

      // Ống nước & Phụ kiện
      {
        name: 'Ống nhựa uPVC Bình Minh Phi 90 Dày 3.0mm (Cây 4m)',
        categoryId: catMap['Ống nước & Phụ kiện'],
        brand: 'Bình Minh',
        price: 185000,
        unit: 'Cây (4m)',
        stock: 200,
        image: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=600&q=80',
        description: 'Ống thoát nước trục đứng chịu lực tốt, chống ăn mòn hóa chất và tuổi thọ trên 50 năm.',
      },
      {
        name: 'Ống cấp nước nóng PPR Tiền Phong Phi 25 (Cây 4m)',
        categoryId: catMap['Ống nước & Phụ kiện'],
        brand: 'Tiền Phong',
        price: 95000,
        unit: 'Cây (4m)',
        stock: 300,
        image: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=600&q=80',
        description: 'Chịu nhiệt độ nước lên tới 95 độ C, an toàn vệ sinh nguồn nước sinh hoạt không đóng cặn.',
      },
      {
        name: 'Keo dán ống nhựa PVC Bình Minh 500g',
        categoryId: catMap['Ống nước & Phụ kiện'],
        brand: 'Bình Minh',
        price: 65000,
        unit: 'Lon',
        stock: 150,
        image: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=600&q=80',
        description: 'Keo dán chuyên dụng liên kết mối nối ống uPVC cực kỳ chắc chắn, chống rò rỉ áp lực cao.',
      },

      // Chống thấm & Hóa chất
      {
        name: 'Hợp chất chống thấm Sika Latex TH (Can 5 Lít)',
        categoryId: catMap['Chống thấm & Hóa chất'],
        brand: 'Sika Thụy Sĩ',
        price: 360000,
        unit: 'Can (5 Lít)',
        stock: 140,
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80',
        description: 'Phụ gia nhũ tương cải tiến dùng trộn với xi măng cát để chống thấm sàn vệ sinh, ban công, dặm vá bê tông.',
      },
      {
        name: 'Sơn chống thấm Kova CT-11A Plus Sàn (Thùng 20kg)',
        categoryId: catMap['Chống thấm & Hóa chất'],
        brand: 'Kova',
        price: 1980000,
        unit: 'Thùng (20kg)',
        stock: 80,
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80',
        description: 'Chống thấm chuyên sâu cho sàn bê tông sân thượng, ban công và hầm ngầm, ngăn nước thẩm thấu tuyệt đối.',
      },
      {
        name: 'Keo dán gạch chống thấm Webertai Fix',
        categoryId: catMap['Chống thấm & Hóa chất'],
        brand: 'Weber',
        price: 285000,
        unit: 'Bao (25kg)',
        stock: 180,
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80',
        description: 'Cường độ bám dính cao gấp 4 lần vữa hồ dầu, chống bong tróc gạch khổ lớn và gạch granite.',
      },
    ];

    await Product.insertMany(productsData);

    // 3. Seed Demo Users (1 Customer + 1 Admin)
    console.log('Seeding Demo Users (Customer & Admin)...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('123456', salt);

    const demoUser = await User.create({
      fullName: 'Nguyễn Văn Khách',
      email: 'demo@vlxdhub.vn',
      passwordHash: passwordHash,
      phone: '0901234567',
      role: 'customer',
    });

    const adminUser = await User.create({
      fullName: 'Quản Trị Viên VLXD',
      email: 'admin@vlxdhub.vn',
      passwordHash: passwordHash,
      phone: '0988888888',
      role: 'admin',
    });

    // Create an empty cart for demo user
    await Cart.create({
      userId: demoUser._id,
      items: [],
    });

    console.log('----------------------------------------------------');
    console.log(' SEEDING COMPLETED SUCCESSFULLY!');
    console.log(` Categories count: ${createdCategories.length}`);
    console.log(` Products count  : ${productsData.length}`);
    console.log(` Customer User   : demo@vlxdhub.vn / 123456 (Role: customer)`);
    console.log(` Admin User      : admin@vlxdhub.vn / 123456 (Role: admin)`);
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
