
//const { ConfigBase } = require('aws-sdk/lib/config-base');
const db = require('.');

beforeAll(async()=>{
    await db.sequelize.sync({force: true})
});

test("create user", async () => {
    const newUser = await db.users.create({
        email: "uzomezu@gmail.com",
        username: "uzoKev",
        password: "password"
    });

    expect(newUser.id).toEqual(1)
});

test("get user", async ()=>{
    expect.assertions(4)
    const user = await db.users.findByPk(1);
    expect(user.id).toEqual(1);
    expect(user.email).toEqual("uzomezu@gmail.com");
    expect(user.username).toEqual("uzoKev");
    expect(user.password).toEqual("password");
});

test("create channel", async ()=>{
    expect.assertions(3)
    const newChannel = await db.channels.create({
        name: "Kevin's new Channel",
        userId: 1,
    });

    expect(newChannel.id).toEqual(1);
    expect(newChannel.userId).toEqual(1);
    expect(newChannel.name).toEqual("Kevin's new Channel");

});

test("upload video", async () => {
    expect.assertions(6)
    const newVideo = await db.videos.create({
        title: "new video title",
        url: "http://localhost:3000/users/1/channels/1/videos/1",
        userId:1,
        channelId:1 
    });

    expect(newVideo instanceof db.videos).toEqual(true);
    expect(newVideo.id).toEqual(1);
    expect(newVideo.title).toEqual("new video title");
    expect(newVideo.url).toEqual("http://localhost:3000/users/1/channels/1/videos/1");
    expect(newVideo.userId).toEqual(1);
    expect(newVideo.channelId).toEqual(1);



});
test("create a tag and add it to a video", async()=>{
    const myVideo = await db.videos.findOne({where:{
        id: 1
    }})
    
    const tags = await myVideo.createTag({
        name: "big boobs"
    })
    
    expect(tags.id).toEqual(1);
    expect(tags.name).toEqual("big boobs")

})
test("get video tags", async () => {
    
    const allTags = await db.tags.findAll();
    expect(allTags.length).toEqual(1)
})

test("delete user", async () => {
    expect.assertions(1)
    await db.users.destroy({where:{
        id: 1
    }});
    const deletedUser = await db.users.findByPk(1);

    expect(deletedUser).toBeNull();
});

afterAll(async ()=>{
    await db.sequelize.close()
})