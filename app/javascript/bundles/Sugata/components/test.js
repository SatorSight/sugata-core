import React, { Component } from "react";

class OtherIssues extends React.Component {
    render() {
        return (
            <div style={styles.OtherIssues}>
                <h3 style={styles.titleOtherIssues}>Другие выпуски</h3>
                <div style={styles.SwipeableViews}>
                    {fixtures.map((fixtures, currentIndex) => {
                        return (
                            <div style={styles.SwipeableItem} key={String(currentIndex)}>
                                <div style={styles.innerOtherIssues}>
                                    <img src={fixtures.main_image} alt={fixtures.title} style={styles.imgOtherIssues} />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div style={styles.fotOtherIssues}>
                    <button style={styles.buttonOtherIssues}>Смотреть все</button>
                </div>
            </div>
        );
    }
}

const styles = {
    OtherIssues: {
        width: '100%',
        position: 'relative',
        backgroundColor: '#F5F5F5',
        overflow: 'hidden',
    },
    titleOtherIssues: {
        fontSize: 14,
        textTransform: 'uppercase',
        fontFamily: 'Arial, serif',
        fontWeight: 400,
        padding: '35px 30px 15px 25px',
        letterSpacing: 3,
    },
    SwipeableViews: {
        padding: '0 0 10px 25px',
        width: 'auto',
        overflowX: 'auto',
        overflowY: 'hidden',
    },
    SwipeableItem: {
        minWidth: 50,
        height: 150,
        display: 'table-cell',
        position: 'relative',
    },
    imgOtherIssues: {
        height: 150,
        margin: '0 20px 0 0',
        borderRadius: 2,
        boxShadow: '1px 1px 3px rgba(0,0,0,0.3)',
    },
    fotOtherIssues: {
        margin: '5px 25px 20px',
        textAlign: 'center',
    },
    buttonOtherIssues: {
        fontSize: 12,
        textTransform: 'uppercase',
        fontFamily: 'Arial, serif',
        fontWeight: 400,
        width: '100%',
        maxWidth: 400,
        margin: '0 auto',
        borderRadius: 20,
        lineHeight: 2.5,
        letterSpacing: 3,
        border: '1px solid #E0E0E0',
        backgroundColor: '#F5F5F5',
    },
};

const fixtures = [
    {id: 1, title: 'Мисс MAXIM 2017', text: 'Я есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грутЯ есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грутЯ есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грут ....', cover_image: '/images/1/img.jpg', main_image: 'images/1/main_img.jpg', name: 'Maxim', date: 'Ноябрь 2017'},
    {id: 2, title: 'Мисс MAXIM 2016', text: 'Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ ....', cover_image: '/images/2/img.jpg', main_image: 'images/2/main_img.jpg', name: 'Maxim', date: 'Ноябрь 2017'},
    {id: 3, title: 'Мисс MAXIM 2018', text: 'Принцесса Пупырчатого Королевства, Принцесса Бугристого Пространства (сокращенно ППК и Пупырка ), также известна как Принцесса Пупырка (англ. Lumpy Space Princess) — дочь Королевы и Короля Бугристого Пространства. Является одной из трех самых часто встречающихся в мультфильме ...', cover_image: '/images/3/img.gif', main_image: 'images/3/main_img.jpg', name: 'Maxim', date: 'Ноябрь 2017'},
    {id: 4, title: 'Мисс MAXIM 2017', text: 'Я есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грутЯ есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грутЯ есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грут Я есть грут ....', cover_image: '/images/1/img.jpg', main_image: 'images/1/main_img.jpg', name: 'Maxim', date: 'Ноябрь 2017'},
    {id: 5, title: 'Мисс MAXIM 2016', text: 'Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ Я ЕСТЬ ГРУТ ....', cover_image: '/images/2/img.jpg', main_image: 'images/2/main_img.jpg', name: 'Maxim', date: 'Ноябрь 2017'},
    {id: 6, title: 'Мисс MAXIM 2018', text: 'Принцесса Пупырчатого Королевства, Принцесса Бугристого Пространства (сокращенно ППК и Пупырка ), также известна как Принцесса Пупырка (англ. Lumpy Space Princess) — дочь Королевы и Короля Бугристого Пространства. Является одной из трех самых часто встречающихся в мультфильме ...', cover_image: '/images/3/img.gif', main_image: 'images/3/main_img.jpg', name: 'Maxim', date: 'Ноябрь 2017'},
];

export default OtherIssues;
