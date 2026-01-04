'use client'

import Link from 'next/link'

import Matches from './Matches/Matches';

export default function RankingsComponent() {
  return (
    <div className='rankings'>
        <h5 className='rankings-title'> 
            <img src="/images/match/team1-copyright.png" alt="National" className="rankings-title--icon"/>
            Anh - Premier League
        </h5>
         <table className='matches-table'>
            <colgroup span={1}>
              <col width="2" />
              <col width="20" />
              <col width="4" />
              <col width="4" />
              <col width="4" />
              <col width="4" />
              <col width="4" />
              <col width="4" />
              <col width="4" />
            </colgroup>
            <thead>
              <tr className='pointer-events-none'>
                  <td>#</td>
                  <td></td>
                  <td>TR</td>
                  <td>T</td>
                  <td>H</td>
                  <td>B</td>
                  <td>+/-</td>
                  <td>HS</td>
                  <td>Đ</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                  <td>1</td>
                  <td>
                    <div className="flex items-center">
                      <img src="/images/match/8600_xsmall.png" alt="National" className="w-5 h-5 mr-3"/>
                      Anh - Premier League
                    </div>
                  </td>
                  <td>3</td>
                  <td>3</td>
                  <td>0</td>
                  <td>0</td>
                  <td>13-3</td>
                  <td>+10</td>
                  <td>9</td>
              </tr>

              <tr>
                  <td>2</td>
                  <td>
                    <div className="flex items-center">
                      <img src="/images/match/9789_xsmall.png" alt="National" className="w-5 h-5 mr-3"/>
                      Anh - Premier League
                    </div>
                  </td>
                  <td>3</td>
                  <td>3</td>
                  <td>0</td>
                  <td>0</td>
                  <td>13-3</td>
                  <td>+10</td>
                  <td>9</td>
              </tr>

              <tr>
                  <td>3</td>
                  <td>
                    <div className="flex items-center">
                      <img src="/images/match/team1-copyright.png" alt="National" className="w-5 h-5 mr-3"/>
                      Anh - Premier League
                    </div>
                  </td>
                  <td>3</td>
                  <td>3</td>
                  <td>0</td>
                  <td>0</td>
                  <td>13-3</td>
                  <td>+10</td>
                  <td>9</td>
              </tr>

              <tr>
                  <td>4</td>
                  <td>
                    <div className="flex items-center">
                      <img src="/images/match/9789_xsmall.png" alt="National" className="w-5 h-5 mr-3"/>
                      Anh - Premier League
                    </div>
                  </td>
                  <td>3</td>
                  <td>3</td>
                  <td>0</td>
                  <td>0</td>
                  <td>13-3</td>
                  <td>+10</td>
                  <td>9</td>
              </tr>
            </tbody>
        </table> 
    </div>
    
  )
}
