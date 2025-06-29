import { FormattedMessage } from 'react-intl';
import Button from 'components/common/Button';
import Footer from 'components/common/Footer';
import { useGameSliceSelector, useGameSliceDispatch } from 'store/reduxHooks';
import { startNewGame, setModalStatus, setAppStatus } from 'store/gameSlice';
import SavedGameModal from './SavedGameModal';
import BgLayer0 from 'img/titlePage/spice-hustle-title-page-bg.svg';
import ImgCloud1 from './images/ImgCloud1';
import ImgCloud2 from './images/ImgCloud2';
import ImgCloud3 from './images/ImgCloud3';
import ImgCloud4 from './images/ImgCloud4';
import styles from 'styles/modules/titlePage.module.scss';
import { AppStatuses } from 'types';

const TitlePage = () => {
  const { modalStatus } = useGameSliceSelector((state) => state.game);
  const isModalOpen = modalStatus !== 'closed';
  const dispatch = useGameSliceDispatch();
  const handleStartNewGame = () => {
    dispatch(startNewGame());
  };
  const handleOpenSavedGameModal = () => {
    dispatch(setModalStatus('opening'));
    setTimeout(() => {
      dispatch(setModalStatus('open'));
    }, 510);
  };
  const handleOpenAbout = () => {
    dispatch(setAppStatus(AppStatuses.AboutPage));
  };
  return (
    <div className="w-full min-h-[100vh] relative" data-testid="title-page">
      <div
        data-testid="title-page-bg"
        className="absolute w-full min-w-[100vw] h-full min-h-[100vh] left-0 top-0 overflow-hidden pointer-events-none"
      >
        <div
          className="w-full min-w-[100vw] h-full min-h-[100vh] absolute left-0 top-0 bg-no-repeat bg-cover bg-center pointer-events-none transition-all duration-50 opacity-50"
          aria-hidden="true"
          style={{
            backgroundImage: `url(${BgLayer0})`,
          }}
        />

        <div aria-hidden="true" className={`${styles.cloud} ${styles.cloud1}`}>
          <ImgCloud1 />
        </div>
        <div aria-hidden="true" className={`${styles.cloud} ${styles.cloud2}`}>
          <ImgCloud2 />
        </div>
        <div aria-hidden="true" className={`${styles.cloud} ${styles.cloud3}`}>
          <ImgCloud3 />
        </div>
      </div>
      <div className="relative min-h-[calc(100vh_-_2rem)]">
        <header className="pt-[6rem]">
          <h1 className="leading-none text-center relative">
            <span className="block text-[8rem] lg:text-[10rem] text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-red-600 drop-shadow-3xl">
              <FormattedMessage id="title_page__title" />
            </span>
          </h1>
        </header>
        <div
          data-testid="title-page-bg-2"
          className="absolute w-full min-w-[100vw] h-full min-h-[100vh] left-0 top-0 overflow-hidden pointer-events-none"
        >
          <div aria-hidden="true" className={`${styles.cloud} ${styles.cloud4}`}>
            <ImgCloud4 />
          </div>
        </div>

        <main className="container min-h-90vh mx-auto px-4 text-center">
          <div className="max-w-3xl py-[4rem] mx-auto text-center text-xl italic text-blue-100 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.9)]">
            <FormattedMessage id="title_page__explainer" />
          </div>
          <div className="pb-[6rem] text-center">
            <span className="p-2">
              <Button
                labelKey="title_page__btn_start_new"
                variant="primary"
                onClick={() => handleStartNewGame()}
                testId="btn-start-new"
              />
            </span>
            <span className="p-2">
              <Button
                labelKey="title_page__btn_load_save"
                variant="secondary"
                reverse
                onClick={() => handleOpenSavedGameModal()}
                testId="btn-load-save"
              />
            </span>
            <span className="p-2">
              <Button
                labelKey="title_page__btn_how_to_play"
                variant="secondary"
                reverse
                onClick={() => handleOpenAbout()}
                testId="btn-how-to-play"
              />
            </span>
          </div>
        </main>
      </div>
      {/* <Footer /> */}
      {isModalOpen && <SavedGameModal />}
    </div>
  );
};

export default TitlePage;
